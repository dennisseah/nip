import { Command } from "commander";
import { CommandBase } from "./commandBase";
import { Logger } from "../utils/logger";
import * as fs from "fs";
import * as path from "path";

export class ListCommand extends CommandBase {
    protected addOptions(cmd: Command): Command {
        return super.addOptions(cmd).option("-d --datadir <datadir>", "data folder name.");
    }
    protected async perform(): Promise<void> {
        const dataDir = this.getOptionString("datadir", path.join(".", "data"));

        Logger.log("Test data files:");

        const files = fs
            .readdirSync(dataDir)
            .filter((f) => f.endsWith(".json") || f.endsWith(".yaml"));
        files.forEach((f) => Logger.log(`  ${f}`));
    }
}
