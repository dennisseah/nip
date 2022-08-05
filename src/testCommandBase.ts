import { CommandBase } from "./commandBase";
import { Logger } from "./utils/logger";
import { Validator } from "./utils/validator";
import * as request from "./request";

import { env } from "process";
import { JSONPath, JSONPathOptions } from "jsonpath-plus";

export abstract class TestCommandBase extends CommandBase {
    protected extractVariables(
        variables: Map<String, String>,
        result: object,
        variablesCfg: Map<String, String>
    ): void {
        if (variablesCfg) {
            const vars = new Map(Object.entries(variablesCfg));
            [...vars.keys()].forEach((k) => {
                const val = JSONPath({ path: vars.get(k), json: result } as JSONPathOptions);
                if (val.length === 1) {
                    variables.set(k, val[0]);
                }
            });
        }
    }
    protected dumpVariables(variables: Map<String, String>): void {
        const envKeys = [...Object.keys(env)];
        const keepKeys = [...variables.keys()].filter(
            (k) => envKeys.indexOf(k as string) === -1
        );
        const dict = keepKeys.reduce((a, c) => {
            a.set(c, variables.get(c) as string);
            return a;
        }, new Map<String, String>());
        Logger.log(JSON.stringify(Object.fromEntries(dict), null, 2));
    }
    protected validate(result: object, validations: request.RequestItemValidation[]): void {
        if (validations) {
            validations.forEach(validation => {
                if (validation.type === "validateMapValues") {
                    const params = validation.parameters as request.ValidateMapValuesParameters;
                    Validator.validateMapValues(result, params.path, params.valuePath, params.expectedVal, params.all);
                } else if (validation.type === "validateExist") {
                    const params = validation.parameters as request.ValidateExistParameters;
                    Validator.validateExist(result, params.path);
                }
            });
        }
    }
    protected polling(result: object, poll: request.RequestItemPoll): boolean {
        if (poll) {
            if (poll.type === "bool_true") {
                const val = JSONPath({ path: poll.path, json: result,} as JSONPathOptions);
                return val.length === 1 && val[0] === true;
            } else if (poll.type === "bool_false") {
                const val = JSONPath({ path: poll.path, json: result,} as JSONPathOptions);
                return val.length === 1 && val[0] === false;
            } else if (poll.type === "empty_list") {
                return Array.isArray(result) && result.length === 0;
            }
            throw new Error(`Unknown poll type, ${poll.type}`);
        }
        return true;
    }
}
