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
import { StringUtils } from "../utils/stringUtils";

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
                    variables.set(StringUtils.fillTokens(k, variables), val[0]);
                }
            });
        }
    }
    protected populateVariables(
        incoming: Map<string, string>,
        variables: Map<string, string>
    ): void {
        if (incoming) {
            const vars = new Map(Object.entries(incoming));
            [...vars.keys()].forEach((k) => {
                variables.set(k, StringUtils.fillTokens(vars.get(k), variables));
            });
        }
    }

    protected dumpVariables(id: string, variables: Map<string, string>): void {
        const envKeys = [...Object.keys(env)];
        const keepKeys = [...variables.keys()].filter((k) => envKeys.indexOf(k as string) === -1);
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
                Validator.validate(result, validation.type, validation.parameters, variables)
            );
        }
    }
    protected polling(result: any, poll: request.RequestItemPoll): boolean {
        return poll ? Poller.poll(result, poll.type, poll.path) : true;
    }
    protected repeat(repeat: request.RequestItemRepeat, variables: Map<string, string>): boolean {
        if (repeat && variables) {
            const counterVar = repeat.counterVariable;
            const strCounter = variables.has(counterVar) ? variables.get(counterVar) : "0";
            if (strCounter !== undefined) {
                const count = parseInt(strCounter, 10);
                if (count >= repeat.total - 1) {
                    variables.set(counterVar, "0");
                    return true;
                }
                variables.set(counterVar, (count + 1).toString());
                return false;
            }
        }
        return true;
    }

    protected loadVariables(id: string, dataVariable: Map<string, string>, restart: boolean) {
        const variables = new Map(Object.entries(dataVariable));
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        Object.keys(env).forEach((k) => variables.set(k, env[k]!.toString()));

        if (!restart) {
            const cachedVariables = VariableCache.fetch(id);
            [...cachedVariables.keys()].forEach((k) =>
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                variables.set(k, cachedVariables.get(k)!)
            );
        } else {
            VariableCache.clear(id);
        }

        return variables;
    }
}
