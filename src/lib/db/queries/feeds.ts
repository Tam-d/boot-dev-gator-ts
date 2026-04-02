import { db } from "../index.js";
import { Feed, feeds, users } from "../schema.js";
import { eq } from "drizzle-orm";

export async function createFeed(feed: Feed) {
  const [result] = await db
    .insert(feeds)
    .values(feed)
    .returning();
  return result;
}

export async function getFeeds() {
  const result = await db
    .select()
    .from(feeds)
    .innerJoin(users, eq(feeds.userId, users.id));

  return result;
}