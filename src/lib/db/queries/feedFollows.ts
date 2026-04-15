import { db } from "../index.js";
import { feedFollows } from "../schema/feedFollows.js";
import { feeds } from "../schema/feeds.js";
import { users } from "../schema/users.js";
import { and, eq } from "drizzle-orm";

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
    .where(
        and(
            eq(feedFollows.id, feedFollow.id),
            eq(feedFollows.userId, users.id)
        )
    )
    .innerJoin(feeds, eq(feeds.id, feedFollows.feedId))
    .innerJoin(users, eq(users.id, feedFollows.userId));

  return result;
}

export async function deleteFeedFollow(feedId: string, userId: string) {
  await db
    .delete(feedFollows)
    .where(
      and(
        eq(feedFollows.feedId, feedId),
        eq(feedFollows.userId, userId)
      )
    );
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