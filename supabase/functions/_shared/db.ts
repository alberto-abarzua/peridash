import { and, eq } from "drizzle-orm";

import { PostgresJsDatabase } from "npm:drizzle-orm@0.29.1/postgres-js";

import { symbol, ticker, tickerSettings, tickerSettingsToTicker, users } from "../_shared/schema.ts";

// ---------- HELPERS  ---------------

export type NewUser = typeof users.$inferInsert;
export type NewTickerSettings = typeof tickerSettings.$inferInsert;
export type Ticker = typeof ticker.$inferSelect;
export type NewSymbol = typeof symbol.$inferInsert;
export type Symbol = typeof symbol.$inferSelect;
export type TickerSettings = typeof tickerSettings.$inferSelect;
export type TickerSettingsToTicker = typeof tickerSettingsToTicker.$inferSelect;
export type NewTickerSettingsToTicker = typeof tickerSettingsToTicker.$inferInsert;
export type NewTicker = typeof ticker.$inferInsert;

type TickerWithSettings = {
    ticker: Ticker;
    ticker_settings_to_ticker: TickerSettingsToTicker;
    symbol: Symbol;
};

// ===============================
// ===============================
//
//       Database Functions
//
// ===============================
// ===============================

// =========================--
//      Get or Create
// =========================--

export const get_or_create_user_ticker_settings = async (
    user_id: string,
    db: PostgresJsDatabase,
): Promise<TickerSettings> => {
    let user = await db.select().from(users).where(
        eq(users.supabase_user_id, user_id),
    );
    if (user.length === 0) {
        const new_user: NewUser = { supabase_user_id: user_id, id: user_id };
        user = await db.insert(users).values(new_user);
        const new_settings: NewTickerSettings = {
            user_id,
            plot_range: 7,
            stats_range: 7,
        };
        await db.insert(tickerSettings).values(new_settings);
    }

    const userTickerSettings = await db.select().from(tickerSettings).where(
        eq(tickerSettings.user_id, user_id),
    );

    return userTickerSettings[0];
};

export const get_or_create_symbol = async (
    symbol_str: string,
    exchange_str: string,
    mic_code: string,
    db: PostgresJsDatabase,
): Promise<Symbol> => {
    const found_symbol = await db.select().from(symbol).where(
        and(eq(symbol.symbol, symbol_str), eq(symbol.mic_code, mic_code)),
    );

    if (found_symbol.length === 0) {
        const new_symbol: NewSymbol = {
            exchange: exchange_str,
            symbol: symbol_str,
            mic_code: mic_code,
        };
        await db.insert(symbol).values(new_symbol);
        return get_or_create_symbol(symbol_str, exchange_str, mic_code, db);
    }
    return found_symbol[0];
};

export const get_or_create_user_ticker = async (
    user_id: string,
    symbol_id: string,
    db: PostgresJsDatabase,
): Promise<Ticker> => {
    const settings = await get_or_create_user_ticker_settings(user_id, db);

    const user_tickers = await get_user_list_of_tickers(user_id, db);
    const found_ticker = user_tickers.find((ticker) =>
        ticker.ticker && ticker.ticker.symbol_id === symbol_id
    );
    if (found_ticker) {
        return found_ticker.ticker;
    }

    const new_ticker: NewTicker = { symbol_id: symbol_id };
    const inserted_ticker = await db.insert(ticker).values(new_ticker)
        .returning();
    if (inserted_ticker.length === 0) {
        throw new Error("Ticker not found");
    }

    const newTickerToSettings: NewTickerSettingsToTicker = {
        ticker_id: inserted_ticker[0].id,
        ticker_settings_id: settings.id,
    };

    await db.insert(tickerSettingsToTicker).values(newTickerToSettings);

    return inserted_ticker[0];
};

// =========================--
//      Get
// =========================--

export const get_user_list_of_tickers = async (
    user_id: string,
    db: PostgresJsDatabase,
): Promise<TickerWithSettings[]> => {
    const settings = await get_or_create_user_ticker_settings(user_id, db);
    const tickers = await db.select().from(tickerSettingsToTicker)
        .leftJoin(ticker, eq(tickerSettingsToTicker.ticker_id, ticker.id)).leftJoin(
            symbol,
            eq(ticker.symbol_id, symbol.id),
        )
        .where(eq(tickerSettingsToTicker.ticker_settings_id, settings.id));
    return tickers as TickerWithSettings[];
};

// =========================--
//      Delete
// =========================--

export const delete_user_ticker = async (
    user_id: string,
    ticker_id: string,
    db: PostgresJsDatabase,
) => {
    const settings = await get_or_create_user_ticker_settings(user_id, db);
    await db.delete(tickerSettingsToTicker).where(
        and(
            eq(tickerSettingsToTicker.ticker_settings_id, settings.id),
            eq(tickerSettingsToTicker.ticker_id, ticker_id),
        ),
    );
    const ticker_to_delete_q = await db.select().from(ticker).where(
        eq(ticker.id, ticker_id),
    );
    if (ticker_to_delete_q.length === 0) {
        throw new Error("Ticker not found");
    }
    const ticker_to_delete = ticker_to_delete_q[0];

    // tickers with the same symbol
    const ticker_with_same_symbol = await db.select().from(ticker).where(
        eq(ticker.symbol_id, ticker_to_delete.symbol_id || ""),
    );

    if (ticker_with_same_symbol.length === 1) {
        await db.delete(symbol).where(
            eq(symbol.id, ticker_to_delete.symbol_id || ""),
        );
    }

    await db.delete(ticker).where(eq(ticker.id, ticker_id)).execute();
};

// =========================--
//      Update
// =========================--

export const update_user_ticker = async (
    user_id: string,
    ticker_id: string,
    new_ticker_info: Ticker,
    db: PostgresJsDatabase,
) => {
    const user_tickers = await get_user_list_of_tickers(user_id, db);
    const found_ticker = user_tickers.find((ticker) => ticker.ticker.id === ticker_id);
    if (!found_ticker) {
        throw new Error("Ticker not found");
    }
    const response = await db.update(ticker).set(new_ticker_info).where(eq(ticker.id, ticker_id)).returning();
    console.log(response);
    console.log(new_ticker_info);
};
