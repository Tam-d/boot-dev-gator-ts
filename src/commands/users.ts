import { setUser } from "../config.js";
import { getUserByName } from "../lib/db/queries/users.js";

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