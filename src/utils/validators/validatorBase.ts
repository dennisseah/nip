import { JSONPath, JSONPathOptions } from "jsonpath-plus";
import { WebResponse } from "../requestUtils";

export abstract class ValidatorBase {
    public abstract validate(
        response: WebResponse,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
        parameters: any,
        variables: Map<string, string>
    ): void;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    protected matchPath(obj: any, path: string): any {
        const target = JSONPath({
            path: path,
            json: obj,
        } as JSONPathOptions);
        if (target.length === 0) {
            throw new Error(
                `validation function failed, path, ${path} does not resolve to any value`
            );
        }
        return target;
    }
}
