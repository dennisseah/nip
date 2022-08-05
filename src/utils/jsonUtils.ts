import * as fs from "fs";

export class JSONUtils {
    static fromFile(path: string): object {
        if (!fs.existsSync(path)) {
            throw new Error(`${path} did not exists`);
        }
        return JSON.parse(fs.readFileSync(path, "utf-8"));
    }
    static toFile(json: object, path: string): void {
        fs.writeFileSync(path, JSON.stringify(json, null, 4));
    }
}
