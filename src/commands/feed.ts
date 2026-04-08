import { fetchFeed } from "src/feed";
import { createFeedFollow, getFeedFollowsForUser } from "src/lib/db/queries/feedFollows";
import { createFeed, getFeedByUrl, getFeeds } from "src/lib/db/queries/feeds";
import { User } from "src/lib/db/schema";

export async function handlerAggregate(cmdName: string, ...args: string[]) {

    const feed = await fetchFeed("https://www.wagslane.dev/index.xml");

    console.log(JSON.stringify(feed, null, 2));
}

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

export async function handlerFollowFeed(cmdName: string, user: User, ...args: string[]) {
    if(args.length != 1) {
        throw Error(`Usage: ${cmdName} <url>`);
    }

    const feedUrl = args[0];
    const feed = await getFeedByUrl(feedUrl);

    await createFeedFollow(feed.id, user.id);
}

export async function handlerGetFollowing(cmdName: string, user: User, ...args: string[]) {
    const feedFollows = await getFeedFollowsForUser(user.id);

    for(const feedFollow of feedFollows) {
        console.log(feedFollow.feeds.name);
    }
}