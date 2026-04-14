import { db } from "../index.js";
import { sql } from 'drizzle-orm';
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

export async function getNextFeed() {
  const [nextFeed] = await db
    .select()
    .from(feeds)
    .orderBy(sql`${feeds.lastFetchedAt} desc nulls first`)
    .limit(1);
  return nextFeed;
}

export async function getFeedByUrl(url: string) {
  const [feed] = await db
    .select()
    .from(feeds)
    .where(eq(feeds.url, url))
  return feed;
}

export async function updateFeedFetched(feedId: string) {
  const [feed] = await db
    .update(feeds)
    .set({
      lastFetchedAt: new Date()
    })
    .where(eq(feeds.id, feedId))
    .returning();
  return feed;
}