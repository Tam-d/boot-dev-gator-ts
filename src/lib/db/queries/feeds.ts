import { db } from "../index.js";
import { Feed, feeds } from "../schema.js";

export async function createFeed(feed: Feed) {
  const [result] = await db
    .insert(feeds)
    .values(feed)
    .returning();
  return result;
}