import { WebResponse } from "../requestUtils";
import { ValidatorBase } from "./validatorBase";

export interface ArraySizeParameters {
    path: string;
    expectedVal: number;
}

export class ArraySize extends ValidatorBase {
    validate(
        response: WebResponse,
        parameters: ArraySizeParameters,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        variables: Map<string, string>
    ): void {
        const path = parameters.path;
        const expectedVal = parameters.expectedVal;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const test = this.matchPath(response.body, path)[0] as Array<any>;

        if (test.length !== expectedVal) {
            throw new Error(
                `arraySize validation failed. expected ${expectedVal} but got ${test.length}`
            );
        }
    }
}
