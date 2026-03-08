import { setUser } from "./config.js";

export type CommandHandler = (cmdName: string, ...args: string[]) => void;

export type CommandsRegistry = {
    [key: string]: CommandHandler
}

export function handlerLogin(cmdName: string, ...args: string[]) {
    if( args.length === 0) {
        throw Error(" the login handler expects a single argument, a username");
    }

    const username = args[0];
    setUser(username);
    console.log(`The username, ${username}, has been set`);
}

export function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler) {
    registry[cmdName] = handler;
}

export function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]) {
    registry[cmdName](cmdName, ...args);
}