import { WebResponse } from "../requestUtils";
import { ValidatorBase } from "./validatorBase";

export interface BooleanValueEqParameters {
    path: string;
    expectedVal: boolean;
}

export class BooleanValueEq extends ValidatorBase {
    validate(
        response: WebResponse,
        parameters: BooleanValueEqParameters,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        variables: Map<string, string>
    ): void {
        const path = parameters.path;
        const expectedVal = parameters.expectedVal;
        const test = this.matchPath(response.body, path)[0] as boolean;

        if (test !== expectedVal) {
            throw new Error(
                `booleanValueEq validation failed. expected ${expectedVal} but got ${test}`
            );
        }
    }
}
