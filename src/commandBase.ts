import { Command, OptionValues } from "commander";

import { Logger } from "./utils/logger";

/**
 * Base class for command classes.
 */
export abstract class CommandBase {
    protected subCmd: Command | undefined;
    
    private name = "";

    protected registerCmd(parent: Command, name: string): Command {
        this.name = name;
        this.subCmd = parent.command(name).action(async (): Promise<void> => {
            await this.action();
        });
        this.subCmd.option("-l --loglevel <logLevel>", "log level. off, debug, info, error.", "info");

        return this.addOptions(this.subCmd);
    }

    protected addOptions(cmd: Command): Command {
        return cmd;
    }

    protected async action(): Promise<void> {
        const start = new Date().getTime();
        let cmdOpts: OptionValues | undefined;
        if (this.subCmd !== undefined) {
            cmdOpts = this.subCmd.opts();
        }
        
        try {
            if (cmdOpts !== undefined) {
                Logger.setLevel(Logger.parseLevel(cmdOpts.loglevel as string));
            }
            Logger.debug(`executing ${this.name} command.`);
            await this.doAction();
        } catch (ex) {
            Logger.error((ex as Error).message);
        } finally {
            this.logTimeTaken(start);
        }
    }

    protected abstract doAction(): Promise<void>;

    private logTimeTaken(start: number) {
        const end = new Date().getTime();
        const milliSeconds = end - start;

        if (milliSeconds < 1000) {
            Logger.log(`\ntime taken: ${Math.round(milliSeconds)} milliseconds.`);
            return;
        }
        const seconds = milliSeconds / 1000;

        if (seconds < 60) {
            Logger.log(`\ntime taken: ${Math.round(seconds)} seconds.`);
        } else {
            Logger.log(`\ntime taken: ${Math.round(seconds / 60)} minutes.`);
        }
    }
}
