import { Kysely, PostgresDialect } from "kysely";
import Database from "./schema/Database";
import { Pool } from "pg";
import { createClient } from "@supabase/supabase-js";

export const db = new Kysely<Database>({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: process.env.DATABASE_URL,
    }),
  }),
});

export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);
