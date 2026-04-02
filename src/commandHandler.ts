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

function printFeed(feed: Feed, user: User){

}