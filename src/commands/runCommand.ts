/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Command } from "commander";
import { Helper } from "../utils/helper";
import { HttpRequestHelper } from "../utils/httpRequestHelper";
import { Logger } from "../utils/logger";
import { RequestFile } from "../utils/requestFile";
import { StringUtils } from "../utils/stringUtils";
import { VariableCache } from "../utils/variableCache";

import * as request from "../request";
import * as path from "path";
import { Promise } from "bluebird";
import { env } from "process";
import { TestCommandBase } from "./testCommandBase";
import { WebResponse } from "../utils/requestUtils";

export class RunCommand extends TestCommandBase {
    protected getCommandName(): string {
        return "run";
    }
    protected addOptions(cmd: Command): Command {
        return super
            .addOptions(cmd)
            .option("-d --datadir <datadir>", "data folder name.")
            .requiredOption("-f --filename <filename>", "test file name.")
            .option(
                "-r --restart",
                "restart test run, that's do not use previous run variables.",
                false
            )
            .option("-t --teardown", "run tear down steps.", false);
    }
    protected doAction(): Promise<void> {
        const subCmd = this.subCmd!;
        const dataDir = subCmd.opts().datadir || path.join(".", "data");
        const filename = subCmd.opts().filename;
        const teardown = subCmd.opts().teardown;
        const restart = subCmd.opts().restart;

        const data = RequestFile.fetch(path.join(dataDir, filename));

        data.variables = new Map(Object.entries(data.variables));
        Object.keys(env).forEach((k) =>
            data.variables.set(k, env[k]!.toString())
        );

        if (!restart) {
            const cachedVariables = VariableCache.fetch(data.id);
            [...cachedVariables.keys()].forEach((k) =>
                data.variables.set(k, cachedVariables.get(k)!)
            );
        } else {
            VariableCache.clear(data.id);
        }

        if (data.authentication && data.authentication.apiKeys) {
            data.authentication.apiKeys = new Map(
                Object.entries(data.authentication.apiKeys)
            );
        }

        const steps = teardown ? data.teardowns : data.steps;

        if (steps) {
            return Promise.mapSeries(steps, (item: request.RequestItem) =>
                this.createStep(item, data, teardown)
            )
                .then(() => {
                    Logger.log("completed all the steps");
                    this.dumpVariables(data.id!, data.variables);
                })
                .catch((rejection) => {
                    console.error(`Fail to run all the steps, ${rejection}`);
                    this.dumpVariables(data.id!, data.variables);
                });
        }
        return new Promise((resolve) => resolve());
    }
    private async createStep(
        item: request.RequestItem,
        data: request.Request,
        ignoreError: boolean
    ): Promise<string> {
        return new Promise((resolve, reject) => {
            (async () => {
                try {
                    Logger.log(`run step: ${item.name}`);
                    let completed = false;

                    while (!completed) {
                        this.populateVariables(
                            item.preRequestVariables,
                            data.variables
                        );
                        const result = await this.makeRequest(
                            item,
                            data.authentication,
                            data.variables
                        );
                        Logger.debug(JSON.stringify(result, null, 2));
                        completed = this.polling(result, item.poll);

                        if (completed) {
                            // completed polling
                            if (result) {
                                Logger.log(JSON.stringify(result, null, 2));
                            }
                            this.validate(
                                result,
                                item.validations,
                                data.variables
                            );
                            this.extractVariables(
                                data.variables,
                                result.body,
                                item.variables
                            );
                            completed = this.repeat(
                                item.repeat,
                                data.variables
                            );
                        } else {
                            Logger.log("wait for one minute...");
                            await Helper.sleep(1000 * 60); // one minute
                        }
                    }

                    resolve("completed");
                } catch (ex) {
                    if (ignoreError) {
                        resolve((ex as Error).message);
                    } else {
                        reject(ex);
                    }
                }
            })();
        });
    }
    private makeRequest(
        item: request.RequestItem,
        authentication: request.RequestAuthentication,
        variables: Map<string, string>
    ): Promise<WebResponse> {
        const url = new URL(
            StringUtils.fillTokens(item.request.url, variables)
        );
        const headers = item.request.headers
            ? new Map(Object.entries(item.request.headers))
            : new Map<string, string | number>();

        if (authentication && authentication.apiKeys) {
            const apiKeys = authentication.apiKeys;
            [...apiKeys.keys()].forEach((k) =>
                headers.set(
                    k as string,
                    StringUtils.fillTokens(apiKeys.get(k) as string, variables)
                )
            );
        }

        const qParams = item.request.parameters
            ? new Map(Object.entries(item.request.parameters))
            : undefined;

        if (item.request.method === "POST") {
            const payload = item.request.json
                ? StringUtils.fillTokens(
                      JSON.stringify(item.request.json),
                      variables
                  )
                : undefined;
            return HttpRequestHelper.makePOSTRequest(
                item.name,
                url,
                payload,
                headers,
                qParams
            );
        } else if (item.request.method === "PUT") {
            const payload = item.request.json
                ? StringUtils.fillTokens(
                      JSON.stringify(item.request.json),
                      variables
                  )
                : undefined;
            return HttpRequestHelper.makePUTRequest(
                item.name,
                url,
                payload,
                headers,
                qParams
            );
        } else if (item.request.method === "DELETE") {
            return HttpRequestHelper.makeDELETERequest(
                item.name,
                url,
                headers,
                qParams
            );
        }

        return HttpRequestHelper.makeGETRequest(
            item.name,
            url,
            headers,
            qParams
        );
    }
}
