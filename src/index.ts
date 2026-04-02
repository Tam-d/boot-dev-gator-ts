import { exit } from "node:process";
import { CommandsRegistry, handlerAddFeed, registerCommand, runCommand } from "./commandHandler.js";
import { handlerGetUsers, handlerLogin, handlerRegister } from "./commands/users.js";
import { handlerReset } from "./commands/reset.js";
import { handlerAggregate } from "./commands/feed.js";

async function main() {
    const registry : CommandsRegistry = {};

    registerCommand(registry, "login", handlerLogin);
    registerCommand(registry, "register", handlerRegister);
    registerCommand(registry, "reset", handlerReset);
    registerCommand(registry, "users", handlerGetUsers);
    registerCommand(registry, "agg", handlerAggregate);
    registerCommand(registry, "addfeed", handlerAddFeed);

    const args = process.argv.slice(2);

    if( args.length < 1) {
        console.log("incorrect number of arguments");
        exit(1);
    }

    const command = args[0];
    const commandArgs = args.slice(1);

    console.log(`Command: ${command}, CommandArgs: ${commandArgs}`);

    await runCommand(registry, command, ...commandArgs);
    process.exit(0)
}

main();