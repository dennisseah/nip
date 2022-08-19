/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommandBase } from "./commandBase";
import { Validator } from "../utils/validator";
import { VariableCache } from "../utils/variableCache";
import * as request from "../request";

import { env } from "process";
import { JSONPath, JSONPathOptions } from "jsonpath-plus";
import { Poller } from "../utils/poller";
import { WebResponse } from "../utils/requestUtils";

export abstract class TestCommandBase extends CommandBase {
    protected extractVariables(
        variables: Map<string, string>,
        result: any,
        variablesCfg: Map<string, string>
    ): void {
        if (variablesCfg) {
            const vars = new Map(Object.entries(variablesCfg));
            [...vars.keys()].forEach((k) => {
                const val = JSONPath({
                    path: vars.get(k),
                    json: result,
                } as JSONPathOptions);
                if (val.length === 1) {
                    variables.set(k, val[0]);
                }
            });
        }
    }
    protected dumpVariables(id: string, variables: Map<string, string>): void {
        const envKeys = [...Object.keys(env)];
        const keepKeys = [...variables.keys()].filter(
            (k) => envKeys.indexOf(k as string) === -1
        );
        const dict = keepKeys.reduce((a, c) => {
            a.set(c, variables.get(c) as string);
            return a;
        }, new Map<string, string>());
        VariableCache.store(id, dict);
    }
    protected validate(
        result: WebResponse,
        validations: request.RequestItemValidation[],
        variables: Map<string, string>
    ): void {
        if (validations) {
            validations.forEach((validation) =>
                Validator.validate(
                    result,
                    validation.type,
                    validation.parameters,
                    variables
                )
            );
        }
    }
    protected polling(result: any, poll: request.RequestItemPoll): boolean {
        return poll ? Poller.poll(result, poll.type, poll.path) : true;
    }
}
