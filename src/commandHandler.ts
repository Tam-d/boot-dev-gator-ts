import { User } from "./lib/db/schema/users";

export type CommandHandler = (
    cmdName: string, 
    ...args: string[]
) => Promise<void>;

export type UserCommandHandler = (
  cmdName: string,
  user: User,
  ...args: string[]
) => Promise<void>;

export type CommandsRegistry = {
    [key: string]: CommandHandler
}

export function registerCommand(
    registry: CommandsRegistry, 
    cmdName: string, 
    handler: CommandHandler
) {
    registry[cmdName] = handler;
}

export async function runCommand(
    registry: CommandsRegistry, 
    cmdName: string, 
    ...args: string[]
) {
    await registry[cmdName](cmdName, ...args);
}