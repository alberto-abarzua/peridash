// schema.ts
import {
  varchar,
  boolean,
  integer,
  doublePrecision,
  json,
  pgSchema,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

import {relations} from 'drizzle-orm';
// ----------------------
// --- Peridash Schema
// ----------------------

export const peridashSchema = pgSchema("peridash");

// ---------------------
// --- Users
// ---------------------

export const users = peridashSchema.table('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  supabase_user_id: uuid('supabase_user_id'),
});


// ---------------------
// --- Symbol
// ---------------------
//
export const symbol = peridashSchema.table('symbol', {
  id: uuid('id').defaultRandom().primaryKey(),
  symbol: varchar('symbol', { length: 64 }),
  exchange: varchar('exchange', { length: 64 }),
  mic_code: varchar('mic_code', { length: 64 }),
  price_data: json('price_data'),
  eod_data: json('eod_data'),   
  eod_updated_at: timestamp('eod_updated_at').default(new Date(0)),
  updated_at: timestamp('updated_at').default(new Date(0)),
});

// ---------------------
// --- Ticker
// ---------------------
//
export const ticker = peridashSchema.table('ticker', {
  id: uuid('id').defaultRandom().primaryKey(),
  is_favorite: boolean('is_favorite').default(false),
  symbol_id: uuid('symbol_id'),
  buy: doublePrecision('buy'),
  gain: doublePrecision('gain'),
  loss: doublePrecision('loss'),
});

export const tickerRelations = relations(ticker, ({one,many}) => ({
    symbol: one(symbol, {
        fields: [ticker.symbol_id],
        references: [symbol.id],
    }),
    tickerSettingsToTicker: many(tickerSettingsToTicker),
    }));

// ---------------------
// --- TickerSettings
// ---------------------
//

export const tickerSettings = peridashSchema.table('ticker_settings', {
  id: uuid('id').defaultRandom().primaryKey(),
  user_id: uuid('user_id').references(()=>users.id),
  plot_range: integer('plot_range'),
  stats_range: integer('stats_range'),

});

export const tickerSettingsRelations = relations(tickerSettings, ({many}) => ({
    tickerSettingsToTicker: many(tickerSettingsToTicker),
    }));

// ---------------------
// --- tickerSettingsToTicker
// ---------------------
//

export const tickerSettingsToTicker = peridashSchema.table('ticker_settings_to_ticker', {
    id: uuid('id').defaultRandom().primaryKey(),
    ticker_id: uuid('ticker_id').references(()=>ticker.id),
    ticker_settings_id: uuid('ticker_settings_id').references(()=>tickerSettings.id),
    });


