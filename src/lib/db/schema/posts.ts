import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { feeds } from "../schema";

export type NewPost = typeof posts.$inferInsert;
export type Post = typeof posts.$inferSelect;

export const posts = pgTable("posts", {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    feedId: uuid("feed_id")
        .references(
            () => feeds.id
        ),
    title: text("title").notNull(),
    url: text("url").notNull().unique(),
    description: text("descriptions"),
    publishedAt: timestamp("published_at"),
    createdAt: timestamp("created_at")
        .notNull()
        .defaultNow(),
    updatedAt: timestamp("updated_at")
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date())
});