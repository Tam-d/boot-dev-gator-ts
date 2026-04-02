import { exit } from "node:process";
import { readConfig, setUser } from "../config.js";
import { createUser, getUserByName, getUsers } from "../lib/db/queries/users.js";

export async function handlerLogin(cmdName: string, ...args: string[]) {
    if( args.length === 0) {
        throw Error("the login handler expects a single argument, a username");
    }
    const username = args[0];

    const user = await getUserByName(username);

    if(user === undefined) {
        throw Error(`The user ${username} was not found`);
    }

    setUser(username);
}

export async function handlerRegister(cmdName: string, ...args: string[]) {
    if(args.length === 0) {
        throw Error("The register handler expects a single argument, a username");
    }

    const username = args[0];
    
    if(username === undefined || username === "") {
        throw Error("The register handler expects a single argument, a username");
    }

    console.log(`Attempting to register user, \"${username}\"`);

    const createdUser = await createUser(username);

    if(!createdUser) {
        throw Error("Unable to register user.");
    }
    
    console.log(`User created successfully:\n${createdUser}`);
    
    setUser(createdUser.name);
}

export async function handlerGetUsers(cmdName: string, ...args: string[]) {
    const currUser = readConfig().currentUserName;

    const users = await getUsers();

    for(const user of users) {
        console.log(
            `* ${user.name} ${user.name === currUser? "(current)" : ""}`
        );
    }
}