import { asc } from "drizzle-orm";
import { db } from "../index.js";
import { NewPost, posts } from "../schema/posts.js";

export async function createPost(post: NewPost) {
    const [result] = await db
        .insert(posts)
        .values(post)
        .returning();
    return result;
}

export async function getPostsForUser(userId: string) {
    //TODO: filter by post's feed's user
    const result = await db
        .select()
        .from(posts)
        .orderBy(asc(posts.publishedAt));
    return result;
}