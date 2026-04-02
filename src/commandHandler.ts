import { exit } from "node:process";
import { readConfig, setUser } from "./config.js";
import { createUser, deleteUsers, getUserByName, getUsers } from "./lib/db/queries/users.js";
import { fetchFeed } from "./feed.js";
import { createFeed } from "./lib/db/queries/feeds.js";
import { Feed, User } from "./lib/db/schema.js";

export type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;

export type CommandsRegistry = {
    [key: string]: CommandHandler
}

export function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler) {
    registry[cmdName] = handler;
}

export async function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]) {
    await registry[cmdName](cmdName, ...args);
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

export async function handlerAggregate(cmdName: string, ...args: string[]) {

    const feed = await fetchFeed("https://www.wagslane.dev/index.xml");

    console.log(JSON.stringify(feed, null, 2));
}

function printFeed(feed: Feed, user: User){

}