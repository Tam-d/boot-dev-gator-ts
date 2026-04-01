import { exit } from "node:process";
import { CommandsRegistry, handlerLogin, handlerRegister, registerCommand, runCommand } from "./commandHandler.js";

async function main() {
    const registry : CommandsRegistry = {};

    registerCommand(registry, "login", handlerLogin);
    registerCommand(registry, "register", handlerRegister);

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