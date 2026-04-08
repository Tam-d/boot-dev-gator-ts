import { pgTable, timestamp, uuid, text, uniqueIndex } from "drizzle-orm/pg-core";

export type NewUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Feed = typeof feeds.$inferInsert;
export type FeedFollow = typeof feedFollows.$inferInsert;

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  name: text("name").notNull().unique(),
});

export const feeds = pgTable("feeds", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  name: text("name").notNull(),
  url: text("url").notNull().unique(),
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
});

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