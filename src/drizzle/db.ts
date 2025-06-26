import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@/db/schema";
//We use should Pool instead of Client because we want to use connection pooling
// and we want to use drizzle-orm with it.
//Pool will reuse connections and manage them for us.
// This is more efficient than creating a new Client for each query.
// Client will create a new connection for each query,
// which is not efficient for a web application with many requests.
const pool = new Pool({
  // connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === "true",
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT) || 5432,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
});

//Log the connection details for debugging purposes
export const db = drizzle(pool, {
  logger: true,
  schema: schema,
});
