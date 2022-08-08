import * as fs from "fs";
import * as path from "path";
import * as os from "os";

import { JSONUtils } from "./jsonUtils";
import { Logger } from "./logger";

export class VariableCache {
    private static FOLDER_NAME = ".nip_cache";

    static fetch(id: string | undefined): Map<string, string> {
        if (id) {
            this.createCacheDirectory();
            const fp = this.getCacheFilename(id);
            if (fs.existsSync(fp)) {
                const json = JSONUtils.fromFile(fp);
                return new Map(Object.entries(json));
            }
        }
        return new Map<string, string>();
    }

    static clear(id: string | undefined): void {
        if (id) {
            const fp = this.getCacheFilename(id);
            if (fs.existsSync(fp)) {
                fs.unlinkSync(fp);
            }
        }
    }
    static store(id: string | undefined, data: Map<string, string>): void {
        if (id) {
            this.createCacheDirectory();
            const fp = this.getCacheFilename(id);
            JSONUtils.toFile(Object.fromEntries(data), fp);
            Logger.debug(JSON.stringify(Object.fromEntries(data), null, 4));
        }
    }

    private static createCacheDirectory(): void {
        const fp = this.getCacheDirectory();
        if (!fs.existsSync(fp)) {
            fs.mkdirSync(fp);
        }
    }

    private static getCacheDirectory(): string {
        return path.join(os.homedir(), this.FOLDER_NAME);
    }

    private static getCacheFilename(id: string): string {
        return path.join(this.getCacheDirectory(), id);
    }
}
