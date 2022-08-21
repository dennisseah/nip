import { WebResponse } from "../requestUtils";
import { ValidatorBase } from "./validatorBase";

export interface HTTPStatusCodeEqParameters {
    expectedVal: number;
}

export class HTTPStatusCodeEq extends ValidatorBase {
    validate(
        response: WebResponse,
        parameters: HTTPStatusCodeEqParameters,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        variables: Map<string, string>
    ): void {
        const expectedVal = parameters.expectedVal;

        if (response.statusCode !== expectedVal) {
            throw new Error(
                `httpStatusCodeEq validation failed. expected ${expectedVal} but got ${response.statusCode}`
            );
        }
    }
}
