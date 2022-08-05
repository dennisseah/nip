import { Command } from "commander";
import { Logger } from "./utils/logger";

import * as path from "path";

export abstract class CommandBase {
    protected subCmd: Command | undefined;
    private dataDir: string | undefined;
    private name: String = "";

    protected registerCmd(parent: Command, name: string): Command {
        this.name = name;
        this.subCmd = parent.command(name).action(() => this.action());
        this.subCmd.option(
            "-l --loglevel <logLevel>",
            "log level. off, debug, info, error."
        ).option(
            "-d --datadir <datadir>",
            "data folder name."
        );

        return this.addOptions(this.subCmd);
    }

    protected addOptions(cmd: Command): Command {
        return cmd;
    }

    protected async action(): Promise<void> {
        const start = new Date().getTime();

        try {
            Logger.setLevel(this.subCmd!.opts().loglevel);
            Logger.debug(`executing ${this.name} command.`);
            this.dataDir = this.subCmd!.opts().datadir;
            await this.doAction();
        } finally {
            const end = new Date().getTime();
            Logger.log(`\ntime taken: ${Math.ceil((end - start) / 6000)} minutes.`);
        }
    }

    protected getDataDir(): string {
        return this.dataDir || path.join(".", "data");
    }

    protected abstract doAction(): void;
}
