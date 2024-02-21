import { corsHeaders } from "./cors.ts";

import { RequestHandler } from "npm:@types/express@4.17.21";
import { Request ,Response} from "npm:@types/express@4.17.21";
import type { SupabaseClient, User } from "npm:@supabase/supabase-js@2.39.7";
import { createClient } from "npm:@supabase/supabase-js@2.39.7";

export const preFlightMiddleware: RequestHandler = (req, res, next) => {
    for (const [key, value] of Object.entries(corsHeaders)) {
        res.setHeader(key, value);
    }
    if (req.method === "OPTIONS") {
        res.status(204).end();
    }
    return next();
};

export const getSupabaseClient = async (req:Request,res:Response): Promise<[SupabaseClient,User|null]> => {
    const supabase = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_ANON_KEY") ?? "",
        {global:{headers:{Authorization: req.headers.authorization!}}}
    );
    const {data:{user}} = await supabase.auth.getUser();
    if (!user) {
        res.status(401).json({ error: "Unauthorized Get" }).end();
        return [supabase,null]
    }
    return [supabase,user]

}
