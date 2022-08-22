import { JSONPath, JSONPathOptions } from "jsonpath-plus";

export class Poller {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    public static poll(result: any, type: string, path?: string): boolean {
        if (type === "bool_true") {
            const val = this.getElement(result, path);
            return val.length === 1 && val[0] === true;
        }
        if (type === "bool_false") {
            const val = this.getElement(result, path);
            return val.length === 1 && val[0] === false;
        }
        if (type === "empty_list") {
            return Array.isArray(result) && result.length === 0;
        }
        throw new Error(`Unknown poll type, ${type}`);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private static getElement(result: any, path?: string): any {
        if (path) {
            return JSONPath({ path: path, json: result } as JSONPathOptions);
        }
        throw new Error("Missing path");
    }
}
