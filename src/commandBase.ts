import { Command } from "commander";
import { Logger, LogLevel } from "./utils/logger";

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
            "log level. off, debug, info, error.",
            "info"
        ).option(
            "-d --datadir <datadir>",
            "data folder name."
        );

        return this.addOptions(this.subCmd);
    }

    protected addOptions(cmd: Command): Command {
        return cmd;
    }

    protected action(): void {
        const start = new Date().getTime();
        const cmdOpts = this.subCmd!.opts();

        (async () => {
            try {
                Logger.setLevel(Logger.parseLevel(cmdOpts.loglevel));
                Logger.debug(`executing ${this.name} command.`);
                this.dataDir = cmdOpts.datadir;
                await this.doAction();
            } catch (ex) {
                Logger.error((ex as Error).message);
            } finally {
                const end = new Date().getTime();
                Logger.log(`\ntime taken: ${Math.ceil((end - start) / 60000)} minutes.`);
            }
        })();
    }

    protected getDataDir(): string {
        return this.dataDir || path.join(".", "data");
    }

    protected abstract doAction(): Promise<void>;
}
