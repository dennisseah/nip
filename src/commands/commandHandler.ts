import { Command } from "commander";

export interface CommandHandler {
    register(name: string, cmd: Command): void;
}
