import { exit } from "node:process";
import { CommandsRegistry, handlerLogin, registerCommand, runCommand } from "./commandHandler.js";

function main() {
    const registry : CommandsRegistry = {};

    registerCommand(registry, "login", handlerLogin);

    const args = process.argv.slice(2);
    const command = args[0];
    const commandArgs = args.slice(1);

    console.log(`Command: ${command}, CommandArgs: ${commandArgs}`);

    if( commandArgs.length < 1) {
        console.log("incorrect number of arguments");
        exit(1);
    }

    runCommand(registry, command, ...commandArgs);
}

main();