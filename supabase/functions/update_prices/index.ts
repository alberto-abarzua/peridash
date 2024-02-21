import { eq } from "drizzle-orm";
import { createClient } from "npm:@supabase/supabase-js@2.39.7";
import axiod from "https://deno.land/x/axiod/mod.ts";
import express from "npm:express@4.18.2";
import { drizzle } from "npm:drizzle-orm@0.29.1/postgres-js";

import postgres from "postgres";
import { symbol } from "../_shared/schema.ts";
import { Request, Response } from "npm:@types/express@4.17.21";
import { get_or_create_symbol, StockData, update_eod } from "../_shared/db.ts";
import { getSupabaseClient, preFlightMiddleware } from "../_shared/express_utils.ts";

// ==========================================
//                   Express server
// ==========================================

const app = express();

const connectionString = Deno.env.get("FIXED_DB_URL") ?? "";
const client = postgres(connectionString, { prepare: false });
const db = drizzle(client);

app.use(express.json());
app.use(preFlightMiddleware);

app.get("/update_prices/", async (req: Request, res: Response) => {
    const [_supabase, user] = await getSupabaseClient(req, res);
    if (!user) {
        return;
    }
    const symbols = await db.select().from(symbol).orderBy(symbol.updated_at)
        .limit(30);


    if (symbols.length === 0) {
        return res.status(200).json({ msg: "No symbols found!" });
    }

    const first = symbols[0];
    if (!first || !first.updated_at) {
        return res.status(200).json({ msg: "No symbols found!" });
    }
    const now = new Date();
    const diff = now.getTime() - first.updated_at?.getTime();
    if (diff < 60000) {
        return res.status(200).json({ msg: "Prices updated recently!" });
    }

    const symbolsArray = symbols.map((s) => `${s.symbol}:${s.exchange}`);
    const datetime_end = new Date();
    const datetime_start = new Date();

    datetime_start.setDate(datetime_start.getDate() - 8);

    const start = datetime_start.toISOString();
    const end = datetime_end.toISOString();

    let { data } = await axiod.get("https://api.twelvedata.com/time_series", {
        params: {
            symbol: symbolsArray.join(","),
            timezone: "America/New_York",
            interval: "15min",
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
                return;
            }
        }
        const symbolRecord = await get_or_create_symbol(symbol_str, exchange, mic_code, db);
        db.update(symbol).set({ price_data: info, updated_at: new Date() }).where(
            eq(symbol.id, symbolRecord.id),
        ).execute();
    });

    await update_eod(db);
    return res.status(200).json({ msg: "Prices updated!" });
});

app.listen();
