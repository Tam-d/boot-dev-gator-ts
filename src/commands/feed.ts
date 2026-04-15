import { createFeedFollow } from "src/lib/db/queries/feedFollows.js";
import { createFeed, getFeeds } from "src/lib/db/queries/feeds.js";
import { User } from "src/lib/db/schema/users.js";

export async function handlerAddFeed(cmdName: string, user: User, ...args: string[]) {
    try {
        const feedName = args[0];
        const feedUrl = args[1];

        if(!feedName || !feedUrl) {
            throw Error("Missing required values name or url");
        }

        const feed = await createFeed({
            name: feedName,
            url: feedUrl,
            userId: user.id
        });

        await createFeedFollow(feed.id, user.id);
    }
    catch(error) {
        throw error;
    }
}

export async function handlerGetFeeds(cmdName: string, ...args: string[]) {
    const feeds = await getFeeds();

    for(const feed of feeds) {
        console.log(`Name: ${feed.feeds.name}`);
        console.log(`Url: ${feed.feeds.url}`);
        console.log(`Username: ${feed.users.name}`);
    }
}