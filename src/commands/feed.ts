import { fetchFeed } from "src/feed";
import { createFeedFollow } from "src/lib/db/queries/feedFollows";
import { createFeed, getFeeds, getNextFeed, updateFeedFetched } from "src/lib/db/queries/feeds";
import { User } from "src/lib/db/schema";

export async function handlerAggregate(cmdName: string, ...args: string[]) {
    const duration = args[0];
    const timeBetweenRequests = parseDuration(duration);

    try {
        console.log(`Collecting feeds every ${duration}`);

        scrapeFeeds();

        const interval = setInterval(
            () => {
                scrapeFeeds();
            },
            timeBetweenRequests
        );

        await new Promise<void>((resolve) => {
            process.on("SIGINT", () => {
                console.log("Shutting down feed aggregator...");
                clearInterval(interval);
                resolve();
            });
        });
    }
    catch(error) {
        console.log("An error occured while scraping feeds");
    }


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

async function scrapeFeeds() {
    const nextFeed = await getNextFeed();

    if(!nextFeed) {
        throw new Error("Unable to find the next feed.");
    }

    console.log(
        `Scraping ${nextFeed.url},` +
        `${nextFeed.lastFetchedAt !== undefined ? `last fetched at: ${nextFeed.lastFetchedAt}` : ""}`
    );

    await markFeedFetched(nextFeed.id);

    const feedData = await fetchFeed(nextFeed.url);
    const feedTitle = feedData.channel.title;
    console.log(`${feedTitle}`);

}

async function markFeedFetched(feedId: string) {
    const updatedFeed = await updateFeedFetched(feedId);

    console.log(`The updated feed: `);
    console.log(updatedFeed);

    if(!updatedFeed) {
        throw new Error("Unable to update feed");
    }
}

function parseDuration(durationStr: string): number {
    const regex = /^(\d+)(ms|s|m|h)$/;
    const match = durationStr.match(regex);

    console.log(match);
    
    if(!match) {
        throw new Error("Unable to parse the given duration.");
    }

    const timeVal = parseInt(match[1]);
    const timeUnit = match[2];

    let timeInMilliseconds = 0;
    
    if(timeUnit === 's') {
        //seconds to milliseconds
        timeInMilliseconds = timeVal * 1000;
    }
    else if(timeUnit === 'm') {
        //minute to milliseconds
        timeInMilliseconds = timeVal * 60 * 1000;

    }
    else if(timeUnit === 'h') {
        //hour to milliseconds
        timeInMilliseconds = timeVal * 60 * 60 * 1000;
    }
    else {
        throw new Error(`Unable to parse time unit of "${timeUnit}".`);
    }
    console.log(timeInMilliseconds)
    return timeInMilliseconds;
}