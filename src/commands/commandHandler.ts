import { Command } from "commander";

export interface CommandHandler {
    register(cmd: Command): void;
}
