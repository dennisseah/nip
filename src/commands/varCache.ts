/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { Command } from "commander";
import { CommandHandler } from "../commandHandler"
import { CommandBase } from "../commandBase";
import { VariableCache } from "../utils/variableCache";
import { Logger } from "../utils/logger";

export class VarCache extends CommandBase implements CommandHandler {
    register(cmd: Command): void {
        this.registerCmd(cmd, "var-cache");
    }
    protected addOptions(cmd: Command): Command {
        return super
            .addOptions(cmd)
            .option("-s --show <id>", "show cache for a given identifier.")
            .option("-c --clear <id>", "clear cache for a given identifier.");
    }
    protected doAction(): Promise<void> {
        return new Promise((resolve) => {
            const cacheId = this.subCmd!.opts().show;
            const clearCacheId = this.subCmd!.opts().clear;

            if (cacheId || clearCacheId) {
                if (cacheId) {
                    this.show(cacheId);
                }
                if (clearCacheId) {
                    if (VariableCache.clear(clearCacheId)) {
                        Logger.log(`Cache with id, ${clearCacheId} is deleted`);
                    } else {
                        Logger.log(`Cache with id, ${clearCacheId} was not found`);
                    }
                }
            } else {
                this.list();
            }
            resolve();
        });
    }
    private list() {
        const files = VariableCache.list();

        if (files.length > 0) {
            Logger.log("Cached entries:");
            files.forEach((f) => Logger.log(`  ${f}`));
        } else {
            Logger.log("There was no cached entries");
        }
    }
    private show(cacheId: string) {
        const cache = VariableCache.fetch(cacheId);
        if (cache.size === 0) {
            Logger.log("No entries");
        } else {
            Logger.log(
                JSON.stringify(Object.fromEntries(cache), null, 4)
            );
        }
    }
}
