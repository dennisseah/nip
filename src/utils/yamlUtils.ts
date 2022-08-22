import * as jsyaml from "js-yaml";
import * as fs from "fs";

export class YAMLUtils {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static fromFile(path: string): any {
        if (!fs.existsSync(path)) {
            throw new Error(`${path} did not exists`);
        }
        return jsyaml.load(fs.readFileSync(path, "utf-8"));
    }
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    public static toFile(json: any, path: string): void {
        fs.writeFileSync(path, jsyaml.dump(json));
    }
}
