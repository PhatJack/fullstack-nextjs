//This file defines the database schema for the application using Drizzle ORM.
import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  boolean,
  index,
} from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
		//  id: uuid("id").primaryKey().default(sql`uuid_generate_v7()`)
		//The default uuid is only uuidv4
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email", { length: 255 }).unique().notNull(),
    name: varchar("name", { length: 255 }),
    password: varchar("password").notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    isAdmin: boolean("is_admin").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at"),
    lastLogin: timestamp("last_login"),
  },
	// Create an index on the email column for faster lookups
	// This is useful for authentication and user management operations
  (table) => [index("idx_users_email").on(table.email)]
);
