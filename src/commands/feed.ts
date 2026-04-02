import { exit } from "node:process";
import { readConfig } from "src/config";
import { fetchFeed } from "src/feed";
import { createFeed } from "src/lib/db/queries/feeds";
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
    }
    catch(error) {
        console.log((error as Error).message);
        exit(1);
    }
    
}