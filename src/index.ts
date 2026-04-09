import { CommandsRegistry, registerCommand, runCommand } from "./commandHandler.js";
import { handlerGetUsers, handlerLogin, handlerRegister } from "./commands/users.js";
import { handlerReset } from "./commands/reset.js";
import { handlerAddFeed, handlerAggregate, handlerGetFeeds } from "./commands/feed.js";
import { middleWareLogIn } from "./middleware/middleware.js";
import { handlerFollowFeed, handlerGetFollowing, handlerUnfollow } from "./commands/feedFollow.js";

async function main() {
    
    const args = process.argv.slice(2);

    if( args.length < 1) {
        console.log("incorrect number of arguments");
        process.exit(1);
    }

    const registry : CommandsRegistry = {};
    registerCommand(registry, "login", handlerLogin);
    registerCommand(registry, "register", handlerRegister);
    registerCommand(registry, "reset", handlerReset);
    registerCommand(registry, "users", handlerGetUsers);
    registerCommand(registry, "agg", handlerAggregate);
    registerCommand(registry, "feeds", handlerGetFeeds);

    registerCommand(registry, "addfeed", middleWareLogIn(handlerAddFeed));
    registerCommand(registry, "follow", middleWareLogIn(handlerFollowFeed));
    registerCommand(registry, "following", middleWareLogIn(handlerGetFollowing));
    registerCommand(registry, "unfollow", middleWareLogIn(handlerUnfollow));

    const command = args[0];
    const commandArgs = args.slice(1);

    console.log(`Command: ${command}, CommandArgs: ${commandArgs}`);

    try {
        await runCommand(registry, command, ...commandArgs);
    }
    catch(error) {
        if(error instanceof Error) {
            console.log(
                `Error running command ${command}: ${error.message}`
            );
        }
        process.exit(1);
    }
    
    process.exit(0)
}

main();