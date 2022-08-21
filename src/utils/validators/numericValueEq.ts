import { WebResponse } from "../requestUtils";
import { ValidatorBase } from "./validatorBase";

export interface NumericValueEqParameters {
    path: string;
    expectedVal: number;
}

export class NumericValueEq extends ValidatorBase {
    validate(
        response: WebResponse,
        parameters: NumericValueEqParameters,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        variables: Map<string, string>
    ): void {
        const path = parameters.path;
        const expectedVal = parameters.expectedVal;
        const test = this.matchPath(response.body, path)[0] as number;

        if (test !== expectedVal) {
            throw new Error(
                `numericValueEq validation failed. expected ${expectedVal} but got ${test}`
            );
        }
    }
}
