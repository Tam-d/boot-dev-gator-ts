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
        throw Error("the user does not exist");
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