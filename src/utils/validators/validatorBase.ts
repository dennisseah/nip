/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { JSONPath, JSONPathOptions } from "jsonpath-plus";
import { WebResponse } from "../requestUtils";

export class ValidatorBase {
    public validate(
        response: WebResponse,
        parameters: any,
        variables: Map<string, string>
    ): void {
        throw new Error("not implemented");
    }

    protected matchPath(obj: any, path: string) {
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
