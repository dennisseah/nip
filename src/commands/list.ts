import { Command } from "commander";
import { CommandHandler } from "../commandHandler"
import { Logger } from "../utils/logger";
import * as fs from "fs";
import * as path from "path";
import { CommandBase } from "../commandBase";

export class List extends CommandBase implements CommandHandler{
    register(cmd: Command): void {
        this.registerCmd(cmd, "list");
    }
    protected addOptions(cmd: Command): Command {
        return super.addOptions(cmd)
            .option("-d --datadir <datadir>", "data folder name.")
    }
    protected doAction(): Promise<void> {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const dataDir = this.subCmd!.opts().datadir || path.join(".", "data");

        return new Promise((resolve) => {
            Logger.log("Test data files:");

            const files = fs.readdirSync(dataDir)
                .filter((f) => f.endsWith(".json"));
            files.forEach((f) => Logger.log(`  ${f}`));
            resolve();
        });
    }
}
