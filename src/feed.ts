import { desc } from "drizzle-orm";
import { XMLParser } from "fast-xml-parser";

type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RSSItem[];
  };
};

type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

export async function fetchFeed(feedURL: string) {

    const response = await fetch(feedURL, {
        headers: {
            "User-Agent": "gator"
        }
    });

    const feed = await response.text();

    const feedObj = new XMLParser().parse(feed).rss;
    const channel = feedObj.channel

    if(!feedObj.channel) {
        throw Error("feed does not have the correct shape, missing channel");
    }

    if(
        !channel.title ||
        !channel.link ||
        !channel.description ||
        !channel.item
    ) {
        throw Error("feed does not have the correct shape, missing channel metadata");
    }

    const title = channel.title;
    const link = channel.link;
    const description = channel.description;
    const publishedDate = channel.lastBuildDate;

    let items = []

    if(Array.isArray(channel.item)) {
        items = channel.item;
    }
    else {
        items = [channel.item];
    }

    const rssItems: RSSItem[] = []

    for(const item of items) {
        rssItems.push({
            title: item.title,
            link: item.link,
            description: item.description,
            pubDate: item.pubDate
        });
    }

    const rssFeed: RSSFeed = {
        channel: {
            title: title,
            link: link,
            description: description,
            item: rssItems
        }
    }

    return rssFeed
}