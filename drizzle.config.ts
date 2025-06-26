import { defineConfig } from "drizzle-kit";

// This configuration file is used to define the database schema and migration settings for Drizzle ORM.
// It specifies the schema file, output directory for migrations, the database dialect, and the database
// credentials (in this case, a PostgreSQL database URL).
export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./migrations",
  dialect: "postgresql", // "mysql" | "sqlite" | "postgresql"
  dbCredentials: { url: process.env.DATABASE_URL! },
});
