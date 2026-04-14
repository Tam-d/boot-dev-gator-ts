import { createFeedFollow, deleteFeedFollow, getFeedFollowsForUser } from "src/lib/db/queries/feedFollows";
import { getFeedByUrl } from "src/lib/db/queries/feeds";
import { User } from "src/lib/db/schema/schema";

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

export async function handlerUnfollow(
    cmdName: string, 
    user: User, 
    ...args: string[]
) {

    const feedId = (await getFeedByUrl(args[0])).id;

    if(!feedId) {
        throw new Error("The requested feed was not found");
    }
    await deleteFeedFollow(feedId, user.id);
}