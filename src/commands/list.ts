import { Command } from "commander";
import { CommandHandler } from "../commandHandler"
import { Logger } from "../utils/logger";
import * as fs from "fs";
import { CommandBase } from "../commandBase";

export class List extends CommandBase implements CommandHandler{
    register(cmd: Command): void {
        this.registerCmd(cmd, "list");
    }
    protected async doAction(): Promise<void> {
        return new Promise((resolve) => {
            Logger.log("Test data files:");

            const files = fs.readdirSync(this.getDataDir())
                .filter((f) => f.endsWith(".json"));
            files.forEach((f) => Logger.log(`  ${f}`));
            resolve();
        });
    }
}
