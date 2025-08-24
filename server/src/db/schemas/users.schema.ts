import { integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

export const users = pgTable('users', {
  id: integer("id").primaryKey().notNull().generatedByDefaultAsIdentity(),
  username: varchar("username", { length: 30 }).unique().notNull(),
  email: varchar("email", { length: 50 }).unique().notNull(),
  password: varchar("password", { length: 300 }).notNull(),
  about: varchar("about", { length: 300 }).default("This person is a user of chat-app."),

  refresh_token: varchar("access_token", { length: 500 }).default(""),

  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow()
});

export interface IUsers{
  id?: number;
  username: string;
  email: string;
  password: string;
  about?: string;
  refresh_token?: string;
  created_at?: Date;
  updated_at?: Date;
};