import * as fs from "fs";

export class JSONUtils {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static fromFile(path: string): any {
        if (!fs.existsSync(path)) {
            throw new Error(`${path} did not exists`);
        }
        return JSON.parse(fs.readFileSync(path, "utf-8"));
    }
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    public static toFile(json: any, path: string): void {
        fs.writeFileSync(path, JSON.stringify(json, null, 4));
    }
}
