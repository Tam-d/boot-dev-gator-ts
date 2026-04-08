import { CommandHandler, UserCommandHandler } from "src/commandHandler";
import { readConfig } from "src/config";
import { getUserByName } from "src/lib/db/queries/users";

type MiddleWareLogIn = (handler: UserCommandHandler) => CommandHandler;

export function middleWareLogIn(
    handler: UserCommandHandler
) : CommandHandler {

    return async (cmdName, ...args) => {

        const userName = readConfig().currentUserName;
        const user = await getUserByName(userName);

        if (!user) {
            throw new Error(`User ${userName} not found`);
        }

        await handler(cmdName, user, ...args);
    }
}