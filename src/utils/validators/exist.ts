import { WebResponse } from "../requestUtils";
import { ValidatorBase } from "./validatorBase";

export interface ExistParameters {
    path: string;
}

export class Exist extends ValidatorBase {
    validate(
        response: WebResponse,
        parameters: ExistParameters,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        variables: Map<string, string>
    ): void {
        const test = this.matchPath(response.body, parameters.path);
        if (test[0] === null || test[0] === undefined) {
            throw new Error("exist validation failed.");
        }
    }
}
