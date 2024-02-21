import { corsHeaders } from "../_shared/cors.ts";

import { eq } from "drizzle-orm";
import { createClient } from "npm:@supabase/supabase-js@2.39.7";
import axiod from "https://deno.land/x/axiod/mod.ts";

import { drizzle, PostgresJsDatabase } from "npm:drizzle-orm@0.29.1/postgres-js";

import postgres from "postgres";
import { symbol } from "../_shared/schema.ts";

import { get_or_create_symbol } from "../_shared/db.ts";

interface StockMeta {
    currency: string;
    exchange: string;
    exchange_timezone: string;
    interval: string;
    mic_code: string;
    symbol: string;
    type: string;
}
interface StockData {
    meta: StockMeta;
    status: string;
    values: StockValue[];
}

interface StockValue {
    close: number;
    datetime: string;
    high: number;
    low: number;
    open: number;
    previous_close: number;
    volume: number;
}

const get_eod = (data: StockValue[]): [number, number] => {
    // Group data by date
    const groupedByDate = data.reduce((acc: Record<string, StockValue[]>, curr: StockValue) => {
        const date = curr.datetime.split(" ")[0]; // Extract date part
        if (!acc[date]) acc[date] = [];
        acc[date].push(curr);
        return acc;
    }, {});

    // For each group, sort by datetime and take the last (most recent) entry
    const lastCloseByDate = Object.keys(groupedByDate).map((date) => {
        const sorted = groupedByDate[date].sort((a, b) =>
            new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
        );
        return sorted[0].close; // Take the most recent close price, no need to parseFloat as the type is already number
    });

    // Ensure the dates are sorted to find the last two distinct dates
    const sortedDates = Object.keys(groupedByDate).sort((a, b) =>
        new Date(b).getTime() - new Date(a).getTime()
    );

    // Get the most recent close price and the previous session's EOD close price
    const curPrice = lastCloseByDate[0] || 0; // Most recent
    const eodPrice = sortedDates.length > 1 ? lastCloseByDate[1] : 0; // Previous session

    return [curPrice, eodPrice];
};

const update_eod = async (
    db: PostgresJsDatabase,
): Promise<boolean> => {
    const symbols = await db.select().from(symbol).orderBy(symbol.eod_updated_at)
        .limit(30);

    if (!symbols || symbols.length === 0) {
        return false;
    }
    symbols.forEach(async (s) => {
        const { symbol: symbol_str, exchange, mic_code } = s;
        if (!symbol_str || !exchange || !mic_code) {
            console.error("Invalid symbol or exchange or mic_code, while updating eod data!");
            return;
        }
        const priceData = s.price_data as StockData;
        if (!priceData) {
            console.error("No price data found, while updating eod data!");
            return;
        }

        const [_, eod] = get_eod(priceData.values);
        await db.update(symbol).set({ eod_data: { close: eod }, eod_updated_at: new Date() }).where(
            eq(symbol.id, s.id),
        ).execute();
    });
    return true;
};

const update_prices = async (
    _req: Request,
    db: PostgresJsDatabase,
): Promise<Response> => {
    const headers = new Headers({ ...corsHeaders });
    const symbols = await db.select().from(symbol).orderBy(symbol.updated_at)
        .limit(30);

    if (symbols.length === 0) {
        return new Response(JSON.stringify({ msg: "No ticker to update!" }), {
            status: 200,
            headers,
        });
    }

    const symbolsArray = symbols.map((s) => `${s.symbol}:${s.exchange}`);
    const datetime_end = new Date();
    const datetime_start = new Date();

    datetime_start.setDate(datetime_start.getDate() - 15);

    const start = datetime_start.toISOString();
    const end = datetime_end.toISOString();

    let { data } = await axiod.get("https://api.twelvedata.com/time_series", {
        params: {
            symbol: symbolsArray.join(","),
            timezone: "America/New_York",
            interval: "5min",
            start_date: start,
            end_date: end,
            apikey: Deno.env.get("TWELVEDATA_API_KEY") || "",
        },
    });

    if (symbolsArray.length === 1) {
        data = [data];
    } else {
        data = Object.values(data);
    }

    data.forEach(async (info: StockData) => {
        let { meta: { symbol: symbol_str, exchange, mic_code } } = info as StockData;
        if (!symbol_str || !exchange || !mic_code) {
            if (!mic_code) {
                const found_mic_code = symbols.find((
                    s,
                ) => (s.symbol === symbol_str))
                    ?.mic_code;
                if (!found_mic_code) {
                    throw new Error(`Invalid mic_code for symbol: ${symbol_str} and exchange: ${exchange}`);
                }
                mic_code = found_mic_code;
            } else {
                console.error("Invalid symbol or exchange or mic_code, while updating prices!");
                console.log(symbol_str, exchange, mic_code);
                return;
            }
        }
        const symbolRecord = await get_or_create_symbol(symbol_str, exchange, mic_code, db);
        db.update(symbol).set({ price_data: info, updated_at: new Date() }).where(
            eq(symbol.id, symbolRecord.id),
        ).execute();
    });

    await update_eod(db);

    return new Response(JSON.stringify({ data, symbolsArray }), {
        status: 200,
        headers,
    });
};

async function handler(req: Request): Promise<Response> {
    const headers = new Headers({ ...corsHeaders });
    if (req.method === "OPTIONS") {
        return new Response(null, { status: 204, headers });
    }
    const connectionString = Deno.env.get("SUPABASE_DB_URL") ?? "";
    const client = postgres(connectionString, { prepare: false }); // with pooling
    const db = drizzle(client);
    const supabase = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_ANON_KEY") ?? "",
        {
            global: {
                headers: {
                    Authorization: req.headers.get("Authorization") || "",
                },
            },
        },
    );

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return new Response(JSON.stringify({ error: "Unauthorized!t " }), {
            status: 401,
            headers,
        });
    }

    try {
        return await update_prices(req, db);
    } catch (e) {
        console.error(e);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers,
        });
    }
}

Deno.serve(handler);
