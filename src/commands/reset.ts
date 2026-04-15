import { deleteUsers } from "src/lib/db/queries/users.js";

export async function handlerReset(cmdName: string, ...args: string[]) {
    console.log("Attempting to delete users....");
    const deletedUsers = await deleteUsers();
    console.log(`Deleted the following users:`);

    for(const user of deletedUsers) {
        console.log(user.name);
    }
}