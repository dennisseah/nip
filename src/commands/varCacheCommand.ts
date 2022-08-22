/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { Command } from "commander";
import { CommandBase } from "./commandBase";
import { VariableCache } from "../utils/variableCache";
import { Logger } from "../utils/logger";

export class VarCacheCommand extends CommandBase {
    protected addOptions(cmd: Command): Command {
        return super
            .addOptions(cmd)
            .option("-s --show <id>", "show cache for a given identifier.")
            .option("-c --clear <id>", "clear cache for a given identifier.")
            .option("-a --clearall", "clear all caches.");
    }
    protected async perform(): Promise<void> {
        return new Promise((resolve) => {
            const subCmd = this.subCmd!;
            const clearAll = subCmd.opts().clearall;
            const cacheId = subCmd.opts().show;
            const clearCacheId = subCmd!.opts().clear;

            if (clearAll) {
                VariableCache.clearAll();
            } else if (cacheId || clearCacheId) {
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
            Logger.log(JSON.stringify(Object.fromEntries(cache), null, 4));
        }
    }
}
