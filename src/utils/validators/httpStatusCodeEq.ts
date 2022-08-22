import { WebResponse } from "../requestUtils";
import { ValidatorBase } from "./validatorBase";

export interface HttpStatusCodeEqParameters {
    expectedVal: number;
}

export class HttpStatusCodeEq extends ValidatorBase {
    validate(
        response: WebResponse,
        parameters: HttpStatusCodeEqParameters,
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
