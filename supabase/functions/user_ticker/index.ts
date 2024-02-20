import { corsHeaders } from "../_shared/cors.ts";

import { createClient } from "npm:@supabase/supabase-js@2.39.7";
import type { SupabaseClient } from "npm:@supabase/supabase-js@2.39.7";
import axiod from "https://deno.land/x/axiod/mod.ts";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import {
    delete_user_ticker,
    get_or_create_symbol,
    get_or_create_user_ticker,
    get_or_create_user_ticker_settings,
    get_user_list_of_tickers,
    update_user_ticker,
} from "../_shared/db.ts";

// ===============================
// ===============================
//
//       Endpoint Functions
//
// ===============================
// ===============================
//
const endpoint_get_user_tickers = async (
    _req: Request,
    supabase: SupabaseClient,
    db: PostgresJsDatabase,
): Promise<Response> => {
    const headers = new Headers({ ...corsHeaders });
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers,
        });
    }
    const userSettings = await get_or_create_user_ticker_settings(user.id, db);
    if (!userSettings) {
        return new Response(JSON.stringify({ error: "User settings not found" }), {
            status: 404,
            headers,
        });
    }
    // call the update_prices edge function
    let response = await api.get("/update_prices/", {
        headers: {
            Authorization: `Bearer ${session?.access_token}`,
        },
    });

    const tickers = await get_user_list_of_tickers(user.id, db);

    return new Response(JSON.stringify(tickers), { status: 200, headers });
};

const endpoint_post_add_user_ticker = async (
    req: Request,
    supabase: SupabaseClient,
    db: PostgresJsDatabase,
) => {
    const { data: { user } } = await supabase.auth.getUser();
    const headers = new Headers({ ...corsHeaders });

    if (!user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers,
        });
    }

    const body = await req.json();

    const { symbol, exchange } = body.ticker_info;

    const found_symbol = await get_or_create_symbol(symbol, exchange, db);

    const new_ticker = await get_or_create_user_ticker(
        user.id,
        found_symbol.id,
        db,
    );

    return new Response(
        JSON.stringify({ message: "Ticker added", ticker: new_ticker }),
        {
            status: 200,
            headers,
        },
    );
};

const endpoint_delete_user_ticker = async (
    req: Request,
    supabase: SupabaseClient,
    db: PostgresJsDatabase,
): Promise<Response> => {
    const { data: { user } } = await supabase.auth.getUser();
    const headers = new Headers({ ...corsHeaders });

    if (!user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers,
        });
    }
    // get from query params
    const url = new URL(req.url);
    const ticker_id = url.searchParams.get("ticker_id") || "";

    await delete_user_ticker(user.id, ticker_id, db);
    return new Response(JSON.stringify({ message: "Ticker deleted" }), {
        status: 200,
        headers,
    });
};

const endpoint_put_user_ticker = async (
    req: Request,
    supabase: SupabaseClient,
    db: PostgresJsDatabase,
): Promise<Response> => {
    const { data: { user } } = await supabase.auth.getUser();
    const headers = new Headers({ ...corsHeaders });

    if (!user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers,
        });
    }
    const body = await req.json();
    const { ticker_id, ticker_info } = body;
    await update_user_ticker(user.id, ticker_id, ticker_info, db);
    return new Response(JSON.stringify({ message: "Ticker updated" }), {
        status: 200,
        headers,
    });
};
// ------------------------------------
const endpoint_get_search_ticker = async (
    req: Request,
    _supabase: SupabaseClient,
    _db: PostgresJsDatabase,
) => {
    const url = new URL(req.url);
    const search = url.searchParams.get("search") || "";
    if (search.length < 2) {
        return new Response(JSON.stringify({ error: "Search query too short" }), {
            status: 400,
            headers: new Headers({ ...corsHeaders }),
        });
    }

    const { data } = await axiod.get("https://api.twelvedata.com/symbol_search", {
        params: { symbol: search },
    });
    return new Response(JSON.stringify(data), {
        status: 200,
        headers: new Headers({ ...corsHeaders }),
    });
};
// ---------- ENDPOINT  ---------------

async function handler(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const headers = new Headers({ ...corsHeaders });
    if (req.method === "OPTIONS") {
        return new Response(null, { status: 204, headers });
    }

    // const method = req.method; const body = await req.text();

    // Connect to the database
    const connectionString = Deno.env.get("SUPABASE_DB_URL") ?? "";
    const client = postgres(connectionString, { prepare: false }); // with pooling
    const db = drizzle(client);

    // authenticate with supabase
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

    // ----------------------
    // Routing
    // ----------------------
    //
    const path = "/" + url.pathname.split("/").slice(2).join("/");
    try {
        switch (path) {
            case "/":
                return new Response(
                    JSON.stringify({ message: "Root endpoint response" }),
                    { status: 200, headers },
                );
            case "/tickers/": {
                console.log(req.method);
                switch (req.method) {
                    case "GET":
                        return await endpoint_get_user_tickers(req, supabase, db);
                    case "POST":
                        return await endpoint_post_add_user_ticker(req, supabase, db);
                    case "DELETE":
                        return await endpoint_delete_user_ticker(req, supabase, db);
                    case "PUT":
                        return await endpoint_put_user_ticker(req, supabase, db);
                    default:
                        return new Response(
                            JSON.stringify({ error: "Method Not Allowed" }),
                            {
                                status: 405,
                                headers,
                            },
                        );
                }
            }

            case "/tickers/search/": {
                switch (req.method) {
                    case "GET":
                        return await endpoint_get_search_ticker(req, supabase, db);
                    default:
                        return new Response(
                            JSON.stringify({ error: "Method Not Allowed" }),
                            {
                                status: 405,
                                headers,
                            },
                        );
                }
            }
            default:
                return new Response(JSON.stringify({ error: "Not Found" }), {
                    status: 404,
                    headers,
                });
        }
    } catch (e) {
        console.error(e);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers,
        });
    }
}

Deno.serve(handler);
