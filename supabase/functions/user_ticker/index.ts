import { createClient } from "npm:@supabase/supabase-js@2.39.7";
import axiod from "https://deno.land/x/axiod/mod.ts";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import express from "npm:express@4.18.2";
import { Request, Response } from "npm:@types/express@4.17.21";
import {
    delete_user_ticker,
    get_or_create_symbol,
    get_or_create_user_ticker,
    get_or_create_user_ticker_settings,
    get_user_list_of_tickers,
    update_user_ticker,
} from "../_shared/db.ts";

import { getSupabaseClient, preFlightMiddleware } from "../_shared/express_utils.ts";

const app = express();

const connectionString = Deno.env.get("FIXED_DB_URL") ?? "";
const client = postgres(connectionString, { prepare: false });
const db = drizzle(client);
console.log(connectionString);
console.log("Connected to database");

app.use(express.json());
app.use(preFlightMiddleware);

app.get(
    "/user_ticker/tickers/",
    async (
        req: Request,
        res: Response,
    ) => {
        const [_supabase, user] = await getSupabaseClient(req, res);
        console.log(user);
        if (!user) {
            res.status(404).json([]).end();
            return;
        }
        const userSettings = await get_or_create_user_ticker_settings(user.id, db);
        if (!userSettings) {
            res.status(404).json([]).end();
            return;
        }

        const tickers = await get_user_list_of_tickers(user.id, db);

        res.status(200).json(tickers).end();
    },
);

app.post(
    "/user_ticker/tickers/",
    async (
        req: Request,
        res: Response,
    ) => {
        const [_supabase, user] = await getSupabaseClient(req, res);
        if (!user) {
            return;
        }
        const { symbol, exchange, mic_code } = req.body.ticker_info;
        const found_symbol = await get_or_create_symbol(symbol, exchange, mic_code, db);
        const new_ticker = await get_or_create_user_ticker(
            user.id,
            found_symbol.id,
            db,
        );
        res.status(200).json({ message: "Ticker added", ticker: new_ticker }).end();
    },
);

app.delete(
    "/user_ticker/tickers/",
    async (
        req: Request,
        res: Response,
    ) => {
        const [_supabase, user] = await getSupabaseClient(req, res);
        if (!user) {
            return;
        }

        const ticker_id = req.query.ticker_id as string;

        await delete_user_ticker(user.id, ticker_id, db);

        res.status(200).json({ message: "Ticker deleted" }).end();
    },
);

app.put(
    "/user_ticker/tickers/",
    async (
        req: Request,
        res: Response,
    ) => {
        const [_supabase, user] = await getSupabaseClient(req, res);
        if (!user) {
            return;
        }
        const { ticker_id, ticker_info } = req.body;
        await update_user_ticker(user.id, ticker_id, ticker_info, db);
        res.status(200).json({ message: "Ticker updated" }).end();
    },
);

app.get(
    "/user_ticker/tickers/search/",
    async (
        req: Request,
        res: Response,
    ) => {
        const search = req.query.search as string;
        if (search.length < 2) {
            res.status(400).json({ error: "Search query too short" }).end();
            return;
        }

        const { data } = await axiod.get("https://api.twelvedata.com/symbol_search", {
            params: { symbol: search, show_plan: "true" },
        });

        res.status(200).json(data).end();
    },
);

app.listen();
