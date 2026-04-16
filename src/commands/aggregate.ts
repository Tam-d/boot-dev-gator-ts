import { getNextFeed, updateFeedFetched } from "src/lib/db/queries/feeds.js";
import { fetchFeed, RSSFeed, RSSItem } from "src/feed.js";
import { parseDuration } from "src/lib/time.js";
import { Feed } from "src/lib/db/schema";
import { createPost } from "src/lib/db/queries/posts";

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
    const feedItems = feedData.channel.item;

    console.log(`Scrapings ${feedTitle}`);

    scrapePosts(nextFeed, feedItems);

}

async function markFeedFetched(feedId: string) {
    const updatedFeed = await updateFeedFetched(feedId);

    console.log(
        `Updated last fetch for "${updatedFeed.name}"\n` +
        `to ${updatedFeed.lastFetchedAt}`
    );
}

async function scrapePosts(feed: Feed, feedItems: RSSItem[]) {
    for(const feedItem of feedItems) {
        await createPost({
            feedId: feed.id,
            title: feedItem.title,
            url: feedItem.link,
            description: feedItem.description,
            //TODO: add published date
        });
    }
}