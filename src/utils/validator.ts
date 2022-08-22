import { WebResponse } from "./requestUtils";

export class Validator {
    public static validate(
        obj: WebResponse,
        type: string,
        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        parameters: any,
        variables: Map<string, string> = new Map()
    ): void {
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
