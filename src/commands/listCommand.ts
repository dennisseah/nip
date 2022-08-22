import { Command } from "commander";
import { Logger } from "../utils/logger";
import * as fs from "fs";
import * as path from "path";
import { CommandBase } from "./commandBase";

export class ListCommand extends CommandBase {
    protected addOptions(cmd: Command): Command {
        return super.addOptions(cmd).option("-d --datadir <datadir>", "data folder name.");
    }
    protected async perform(): Promise<void> {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const dataDir = this.subCmd!.opts().datadir || path.join(".", "data");

        return new Promise((resolve) => {
            Logger.log("Test data files:");

            const files = fs
                .readdirSync(dataDir)
                .filter((f) => f.endsWith(".json") || f.endsWith(".yaml"));
            files.forEach((f) => Logger.log(`  ${f}`));
            resolve();
        });
    }
}
