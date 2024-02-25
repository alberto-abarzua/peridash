import { corsHeaders } from "./cors.ts";

import  { Request, RequestHandler, Response } from "expressTypes";
import type { SupabaseClient, User } from "supabase";
import { createClient } from "supabase";

declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}

export const preFlightMiddleware: RequestHandler = (req, res, next) => {
    for (const [key, value] of Object.entries(corsHeaders)) {
        res.setHeader(key, value);
    }
    if (req.method === "OPTIONS") {
        res.status(204).end();
    }
    return next();
};

export const getSupabaseClient = async (
    req: Request,
    res: Response,
): Promise<[SupabaseClient, User | null]> => {
    const supabase = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_ANON_KEY") ?? "",
        { global: { headers: { Authorization: req.headers.authorization! } } },
    );
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        res.status(401).json({ error: "Unauthorized Get" }).end();
        return [supabase, null];
    }
    return [supabase, user];
};

export const getSupabaseAdmin = (
    req: Request,
    res: Response,
): SupabaseClient => {
    const supabase = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        req.headers.authorization?.split(" ")[1]!,
    );
    const adminAuthClient = supabase.auth.admin;
    if (!adminAuthClient) {
        res.status(401).json({ error: "Unauthorized Get" }).end();
        throw new Error("Unauthorized Get");
    }
    return supabase;
};

export const AuthMiddleware: RequestHandler = async (req, res, next) => {
    const [_supabase, user] = await getSupabaseClient(req, res);
    if (!user) {
        res.status(401).send("User is not Authed").end();
        return;
    }
    req.user = user;
    return next();
};

export const AdminAuthMiddleware: RequestHandler = (req, res, next) => {
    const supabase = getSupabaseAdmin(req, res);
    if (!supabase.auth.admin) {
        res.status(401).send("Not an Admin account!").end();
        return;
    }
    return next();
};
