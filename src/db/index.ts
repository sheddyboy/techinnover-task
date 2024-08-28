import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/db/schema";

const client = postgres(process.env.SUPABASE_DB_URL!);
const db = drizzle(client, { schema });

export default db;
