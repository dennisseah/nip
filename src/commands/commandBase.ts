import { Command } from "commander";
import { CommandHandler } from "./commandHandler";
import { Logger } from "../utils/logger";

/**
 * Base class for command classes.
 */
export abstract class CommandBase implements CommandHandler {
    private subCmd: Command | undefined;
    private name = "";

    protected abstract perform(): Promise<void>;

    public register(name: string, cmd: Command): void {
        this.registerCmd(cmd, name);
    }

    protected registerCmd(parent: Command, name: string): Command {
        this.name = name;
        this.subCmd = parent.command(name).action(async (): Promise<void> => {
            await this.execute();
        });
        this.subCmd.option(
            "-l --loglevel <logLevel>",
            "log level. off, debug, info, error.",
            "info"
        );

        return this.addOptions(this.subCmd);
    }

    protected addOptions(cmd: Command): Command {
        return cmd;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    protected getOptionString(key: string, defaultValue?: string): string {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return this.subCmd!.opts()[key] || defaultValue;
    }

    protected getOptionBoolean(key: string): boolean {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return this.subCmd!.opts()[key];
    }

    private async execute(): Promise<void> {
        const start = new Date().getTime();
        const cmdOpts = this.subCmd !== undefined ? this.subCmd.opts() : undefined;

        try {
            if (cmdOpts !== undefined && cmdOpts.loglevel !== undefined) {
                Logger.setLevel(Logger.parseLevel(cmdOpts.loglevel as string));
            }
            Logger.debug(`executing ${this.name} command.`);
            await this.perform();
        } catch (ex) {
            Logger.error((ex as Error).message);
        } finally {
            this.logTimeTaken(start);
        }
    }

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
