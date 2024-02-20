import { corsHeaders } from "../_shared/cors.ts";

import { eq } from "drizzle-orm";
import { createClient } from "npm:@supabase/supabase-js@2.39.7";
import axiod from "https://deno.land/x/axiod/mod.ts";

import { drizzle, PostgresJsDatabase } from "npm:drizzle-orm@0.29.1/postgres-js";

import postgres from "postgres";
import { symbol } from "../_shared/schema.ts";

import { get_or_create_symbol } from "../_shared/db.ts";

interface StockValue {
    close: number;
    datetime: string;
    high: number;
    low: number;
    open: number;
    previous_close: number;
    volume: number;
}
interface StockData {
    meta: {
        currency: string;
        exchange: string;
        exchange_timezone: string;
        interval: string;
        mic_code: string;
        symbol: string;
        type: string;
    };
    status: string;
    values: StockValue[]; // Replace 'any' with a more specific type if you know the structure of the items in this array
}

const update_prices = async (
    _req: Request,
    db: PostgresJsDatabase,
): Promise<Response> => {
    const headers = new Headers({ ...corsHeaders });
    const symbols = await db.select().from(symbol).orderBy(symbol.updated_at).limit(30);
    const symbolsArray = symbols.map((s) => `${s.symbol}:${s.exchange}`);
    const datetime_end = new Date();
    const datetime_start = new Date();
    datetime_start.setDate(datetime_start.getDate() - 30);

    const start = datetime_start.toISOString();
    const end = datetime_end.toISOString();

    const { data } = await axiod.get("https://api.twelvedata.com/time_series", {
        params: {
            symbol: symbolsArray.join(","),
            timezone: "America/New_York",
            interval: "15min",
            previous_close: true,
            start_date: start,
            end_date: end,
            apikey: Deno.env.get("TWELVEDATA_API_KEY") || "",
        },
    });
    for (const [_, _info] of Object.entries(data)) {
        const info = _info as StockData;
        const { meta: { symbol: symbol_str, exchange } } = info;

        const symbolRecord = await get_or_create_symbol(symbol_str, exchange, db);
        console.log(symbolRecord, symbolRecord.id);
        const ouptput = db.update(symbol).set({ price_data: info, updated_at: new Date() }).where(
            eq(symbol.id, symbolRecord.id),
        ).execute();
        console.log(ouptput);
    }
    return new Response(JSON.stringify({ data, symbolsArray }), { status: 200, headers });
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
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
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
