import { JSONPath, JSONPathOptions } from "jsonpath-plus";
import { WebResponse } from "../requestUtils";
import { ValidatorBase } from "./validatorBase";

export interface MapValuesParameters {
    path: string;
    valuePath: string;
    expectedVal: string;
    all: boolean;
}

export class MapValues extends ValidatorBase {
    validate(
        response: WebResponse,
        parameters: MapValuesParameters,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        variables: Map<string, string>
    ): void {
        const path = parameters.path;
        const valuePath = parameters.valuePath;
        const expectedVal = parameters.expectedVal;
        const all = parameters.all;

        const target = this.matchPath(response.body, path);

        const allMatch = Object.values(target[0]).every((val) => {
            const mapVal = JSONPath({
                path: valuePath,
                json: val,
            } as JSONPathOptions);
            return (
                mapVal.length === 1 && expectedVal === JSON.stringify(mapVal[0])
            );
        });

        if (allMatch !== all) {
            throw new Error("MapValues validation failed");
        }
    }
}
