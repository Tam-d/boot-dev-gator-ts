import { exit } from "node:process";
import { readConfig } from "src/config";
import { fetchFeed } from "src/feed";
import { createFeed, createFeedFollow, getFeedByUrl, getFeedFollowsForUser, getFeeds } from "src/lib/db/queries/feeds";
import { getUserByName } from "src/lib/db/queries/users";

export async function handlerAggregate(cmdName: string, ...args: string[]) {

    const feed = await fetchFeed("https://www.wagslane.dev/index.xml");

    console.log(JSON.stringify(feed, null, 2));
}

export async function handlerAddFeed(cmdName: string, ...args: string[]) {
    try {
        const feedName = args[0];
        const feedUrl = args[1];
        const currUsername = readConfig().currentUserName;

        if(!feedName || !feedUrl) {
            throw Error("Missing required values name or url");
        }

        const user = await getUserByName(currUsername);

        const feed = await createFeed({
            name: feedName,
            url: feedUrl,
            userId: user.id
        });

        await createFeedFollow(feed.id, user.id);
    }
    catch(error) {
        console.log((error as Error).message);
        exit(1);
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

export async function handlerFollowFeed(cmdName: string, ...args: string[]) {
    if(args.length != 1) {
        throw Error(`Usage: ${cmdName} <url>`);
    }

    const feedUrl = args[0];
    const feed = await getFeedByUrl(feedUrl);
    const currUser = await getUserByName(readConfig().currentUserName);

    await createFeedFollow(feed.id, currUser.id);
}

export async function handlerGetFollowing(cmdName: string, ...args: string[]) {
    const currUser = await getUserByName(readConfig().currentUserName);
    const feedFollows = await getFeedFollowsForUser(currUser.id);

    for(const feedFollow of feedFollows) {
        console.log(feedFollow.feeds.name);
    }
}