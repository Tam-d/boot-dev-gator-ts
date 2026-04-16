import { pgTable, timestamp, uuid, text } from "drizzle-orm/pg-core";
import { users } from "../schema";

export type Feed = typeof feeds.$inferInsert;
export type ExistingFeed =  typeof feeds.$inferSelect;

export const feeds = pgTable("feeds", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  name: text("name").notNull(),
  url: text("url").notNull().unique(),
  userId: uuid("user_id")
    .references(
      ()=> users.id, 
      { onDelete: "cascade" }
    ),
  lastFetchedAt: timestamp("last_fetched_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});