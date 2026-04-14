import { pgTable, timestamp, uuid, text, uniqueIndex } from "drizzle-orm/pg-core";

export type NewUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  name: text("name").notNull().unique(),
});