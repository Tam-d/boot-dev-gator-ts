import { exit } from "node:process";
import { deleteUsers } from "src/lib/db/queries/users";

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