import { integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { users } from "./users.schema";

export const chats = pgTable("chats", {
    id: integer("id").primaryKey().notNull().generatedByDefaultAsIdentity(),
    sender_id: integer("sender_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    receiver_id: integer("receiver_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    content: varchar("content", { length: 300 }).notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
});

export interface IChat {
    id?: number;
    sender_id: number;
    receiver_id: number;
    content: string;
    created_at?: Date;
}
