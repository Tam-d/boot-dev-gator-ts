import { getNextFeed, updateFeedFetched } from "src/lib/db/queries/feeds";
import { fetchFeed } from "src/feed";
import { parseDuration } from "src/lib/time";

export async function handlerAggregate(cmdName: string, ...args: string[]) {
    const duration = args[0];
    const timeBetweenRequests = parseDuration(duration);

    console.log(`Collecting feeds every ${duration}...`);

    try {
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

async function markFeedFetched(feedId: string) {
    const updatedFeed = await updateFeedFetched(feedId);

    console.log(
        `Updated last fetch for "${updatedFeed.name}"\n` +
        `to ${updatedFeed.lastFetchedAt}`
    );
}