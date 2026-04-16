import { getPostsForUser } from "src/lib/db/queries/posts.js";
import { Post, User } from "../lib/db/schema";

export async function handlerBrowsePosts(cmdName: string, user: User, ...args: string[]) {
    const posts = await getPostsForUser(user.id);
    printPosts(posts);
}

function printPosts(posts: Post[]) {
    const numPosts = posts.length;

    if(numPosts == 0) {
        console.log("No posts to show.....");
    }
    else {
        console.log(`Found ${numPosts} Posts:`);
        for(const post of posts) {
            printPost(post);
        }
    }
}

function printPost(post: Post) {
    console.log(`title: ${post.title}, published at: ${post.publishedAt}`);
    console.log(`${post.description}`);
}
