import { StringUtils } from "../stringUtils";
import { WebResponse } from "../requestUtils";
import { ValidatorBase } from "./validatorBase";

export interface StringValueEqParameters {
    path: string;
    expectedVal: string;
}

export class StringValueEq extends ValidatorBase {
    public validate(
        response: WebResponse,
        parameters: StringValueEqParameters,
        variables: Map<string, string>
    ): void {
        const path = parameters.path;
        const expectedVal = StringUtils.fillTokens(
            parameters.expectedVal,
            variables
        );
        const test = this.matchPath(response.body, path)[0] as string;

        if (test !== expectedVal) {
            throw new Error(
                `StringValueEq validation failed. expected ${expectedVal} but got ${test}`
            );
        }
    }
}
