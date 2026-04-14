import { getNextFeed } from "src/lib/db/queries/feeds";
import { markFeedFetched } from "./feed";
import { fetchFeed } from "src/feed";

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