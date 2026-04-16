import { pgTable, timestamp, uuid, uniqueIndex } from "drizzle-orm/pg-core";
import { users, feeds } from "../schema";

export type FeedFollow = typeof feedFollows.$inferInsert;

export const feedFollows = pgTable("feed_follows", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  feedId: uuid("feed_id")
    .references(
      ()=> feeds.id, 
      { onDelete: "cascade" }
    ),
  userId: uuid("user_id")
    .references(
      ()=> users.id, 
      { onDelete: "cascade" }
    ),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex("user_feed_unique_idx").on(table.userId, table.feedId),
  ]
);