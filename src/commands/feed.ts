import { createFeedFollow } from "src/lib/db/queries/feedFollows";
import { createFeed, getFeeds, updateFeedFetched } from "src/lib/db/queries/feeds";
import { User } from "src/lib/db/schema";

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

export async function markFeedFetched(feedId: string) {
    const updatedFeed = await updateFeedFetched(feedId);

    console.log(`The updated feed: `);
    console.log(updatedFeed);

    if(!updatedFeed) {
        throw new Error("Unable to update feed");
    }
}