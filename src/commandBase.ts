import { Command, OptionValues } from "commander";

import * as path from "path";
import { Logger } from "./utils/logger";

/**
 * Base class for command classes.
 */
export abstract class CommandBase {
    protected subCmd: Command | undefined;
    private dataDir: string | undefined;
    private name = "";

    protected registerCmd(parent: Command, name: string): Command {
        this.name = name;
        this.subCmd = parent.command(name).action(async (): Promise<void> => {
            await this.action();
        });
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

    protected async action(): Promise<void> {
        const start: number = new Date().getTime();
        let cmdOpts: OptionValues | undefined;
        if (this.subCmd !== undefined) {
            cmdOpts = this.subCmd.opts();
        }
        
        try {
            if (cmdOpts !== undefined) {
                Logger.setLevel(Logger.parseLevel(cmdOpts.loglevel as string));
                this.dataDir = cmdOpts.datadir as string;
            }
            Logger.debug(`executing ${this.name} command.`);
            await this.doAction();
        } catch (ex) {
            Logger.error((ex as Error).message);
        } finally {
            const end: number = new Date().getTime();
            Logger.log(`\ntime taken: ${Math.ceil((end - start) / 60000)} minutes.`);
        }
    }

    protected getDataDir(): string {
        return (this.dataDir !== undefined) ? this.dataDir : path.join(".", "data");
    }

    protected abstract doAction(): Promise<void>;
}
