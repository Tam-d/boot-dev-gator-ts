import { db } from "../index.js";
import { Feed, feedFollows, feeds, users } from "../schema.js";
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

export async function getFeedByUrl(url: string) {
  const [feed] = await db
    .select()
    .from(feeds)
    .where(eq(feeds.url, url))
  return feed;
}

export async function createFeedFollow(
  feedId: string, 
  userId: string
) {
  const [feedFollow] = await db
    .insert(feedFollows)
    .values({
      feedId: feedId,
      userId: userId
    })
    .returning();

  if(!feedFollow || feedFollow === null) {
    throw Error("Failed to insert feedFollow");
  }

  const [result] = await db
    .select()
    .from(feedFollows)
    .where(eq(feedFollows.id, feedFollow.id))
    .innerJoin(feeds, eq(feeds.id, feedFollow.feedId!))
    .innerJoin(users, eq(users.id, feedFollow.userId!));

  return result;
}

export async function getFeedFollowsForUser(userId: string) {
  const result = await db
    .select()
    .from(feedFollows)
    .where(eq(feedFollows.userId, userId))
    .innerJoin(feeds, eq(feeds.id, feedFollows.feedId))
    .innerJoin(users, eq(users.id, feedFollows.userId));
  return result;
}