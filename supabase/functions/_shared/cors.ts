export const corsHeaders = {
    "Access-Control-Allow-Origin": Deno.env.get("ALLOWED_ORIGINS") || "*",
    "Access-Control-Allow-Headers": "Authorization, X-Client-Info, ApiKey, Content-Type",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS, PUT, DELETE",
    "Content-Type": "application/json",
};
