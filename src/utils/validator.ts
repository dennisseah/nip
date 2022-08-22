/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { WebResponse } from "./requestUtils";

export class Validator {
    static validate(
        obj: WebResponse,
        type: string,
        parameters: any,
        variables: Map<string, string> = new Map()
    ) {
        let validator;

        try {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const mod = require(`./validators/${type}`);
            const className = type.substring(0, 1).toUpperCase() + type.substring(1);
            validator = new mod[className]();
        } catch (err) {
            throw new Error(`Unknown validation type, ${type}`);
        }

        validator.validate(obj, parameters, variables);
    }
}
