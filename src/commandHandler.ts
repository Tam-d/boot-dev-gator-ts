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

export async function handlerRegister(cmdName: string, ...args: string[]) {
    if(args.length === 0) {
        throw Error("The register handler expects a single argument, a username");
    }

    const username = args[0];
    
    if(username === undefined || username === "") {
        throw Error("The register handler expects a single argument, a username");
    }

    console.log(`Attempting to register username \"${username}\"`);

    try {
        const createdUser = await createUser(username);
        
        console.log(`User created with name ${createdUser.name}`);
        console.log(createdUser);
        
        setUser(createdUser.name);
    }
    catch(error) {
        console.log("There was an issue registering your user....");
        console.log((error as Error).message);
        console.log((error as Error).cause);
        exit(1)
    }
}

export async function handlerGetUsers(cmdName: string, ...args: string[]) {
    try {
        const currUser = readConfig().currentUserName;

        const users = await getUsers();

        for(const user of users) {
            console.log(
                `* ${user.name} ${user.name === currUser? "(current)" : ""}`
            );
        }
    }
    catch(error) {
        console.log("There was an error while fetching users...")
    }
}

export async function handlerReset(cmdName: string, ...args: string[]) {
    try {
        console.log("Attempting to delete users....")
        await deleteUsers();
    }
    catch(error) {
        console.log("There was an issue reseting the database.");
        exit(1);
    }
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