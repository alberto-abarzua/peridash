import { eq } from "drizzle-orm";
import axiod from "https://deno.land/x/axiod/mod.ts";
import { PostgresJsDatabase } from "npm:drizzle-orm@0.29.1/postgres-js";

import { symbol } from "../_shared/schema.ts";
import { RequestHandler } from "npm:@types/express@4.17.21";
import { Request, Response } from "npm:@types/express@4.17.21";
import { get_or_create_symbol } from "../_shared/db.ts";

// ==========================================
//                   Express server
// ==========================================
