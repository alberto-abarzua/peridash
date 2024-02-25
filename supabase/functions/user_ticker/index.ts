
import express from "express";
import axios from "axios"
import { Request, Response } from "expressTypes";
import {
    delete_user_ticker,
    get_or_create_symbol,
    get_or_create_user_ticker,
    get_or_create_user_ticker_settings,
    get_user_list_of_tickers,
    update_user_ticker,
} from "../_shared/db.ts";

import { AuthMiddleware, preFlightMiddleware } from "../_shared/express_utils.ts";

import { dbClient } from "../_shared/db.ts";

const app = express();

app.use(express.json());
app.use(preFlightMiddleware);
app.use(AuthMiddleware);
app.locals.db = dbClient;

app.get(
    "/user_ticker/tickers/",
    async (
        req: Request,
        res: Response,
    ) => {
        const user = req.user!;
        const db = req.app.locals.db;
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
        const user = req.user!;
        const db = req.app.locals.db;
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
        const user = req.user!;
        const db = req.app.locals.db;
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
        const user = req.user!;
        const db = req.app.locals.db;
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

        const { data } = await axios.get("https://api.twelvedata.com/symbol_search", {
            params: { symbol: search, show_plan: "true" ,outputsize: 10},
        });

        res.status(200).json(data).end();
    },
);

app.listen();
