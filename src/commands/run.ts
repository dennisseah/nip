import { Command } from "commander";
import { CommandHandler } from "../commandHandler";
import { Helper } from "../utils/helper";
import { HttpRequestHelper } from "../utils/httpRequestHelper";
import { JSONUtils } from "../utils/jsonUtils";
import { Logger } from "../utils/logger";
import { StringUtils } from "../utils/stringUtils";

import * as request from "../request";
import * as path from "path";
import { Promise } from "bluebird";
import { env } from "process";
import { TestCommandBase } from "../testCommandBase";

export class Run extends TestCommandBase implements CommandHandler {
    register(cmd: Command): void {
        this.registerCmd(cmd, "run");
    }
    protected addOptions(cmd: Command): Command {
        return super.addOptions(cmd)
            .option("-f --filename <filename>", 'test file name.', false)
            .option("-t --teardown", 'run tear down steps.', false);
    }
    protected async doAction(): Promise<void> {
        const filename = this.subCmd!.opts().filename;
        const teardown = this.subCmd!.opts().teardown;

        const fp = path.join(this.getDataDir(), filename);
        const data = JSONUtils.fromFile(fp) as request.Request;

        data.variables = new Map(Object.entries(data.variables));
        Object.keys(env).forEach((k) => data.variables.set(k, env[k]!.toString()));

        if (data.authentication.apiKeys) {
            data.authentication.apiKeys = new Map(Object.entries(data.authentication.apiKeys));
        }

        const steps = teardown ? data.teardowns : data.steps;

        return Promise.mapSeries(steps, (item: request.RequestItem) => this.createStep(item, data, teardown))
            .then(() => {
                Logger.log("completed all the steps");
                this.dumpVariables(data.variables);
            })
            .catch((rejection) => {
                console.error(`Fail to run all the steps, ${rejection}`);
                this.dumpVariables(data.variables);
            });
    }
    private async createStep(item: request.RequestItem, data: request.Request, ignoreError: boolean = false): Promise<string> {
        return new Promise((resolve, reject) => {
            (async () => {
                try {
                    Logger.log(`run step: ${item.name}`);
                    let completed = false;

                    while (!completed) {
                        const result = await this.makeRequest(item, data.authentication, data.variables);
                        Logger.debug(JSON.stringify(result, null, 2));
                        completed = this.polling(result, item.poll);

                        if (completed) {
                            if (result) {
                                Logger.log(JSON.stringify(result, null, 2));
                            }
                            this.validate(result, item.validations);
                            this.extractVariables(data.variables, result, item.variables);
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
        variables: Map<String, String>
    ): Promise<object> {
        const url = new URL(StringUtils.fillTokens(item.request.url, variables));
        const headers = item.request.headers ? new Map(Object.entries(item.request.headers)) : new Map<String, String | Number>();

        if (authentication.apiKeys) {
            const apiKeys = authentication.apiKeys;
            [...apiKeys.keys()].forEach((k) =>
                headers.set(
                    k as string,
                    StringUtils.fillTokens(apiKeys.get(k) as string, variables)
                )
            );
        }

        const qParams = item.request.parameters ? new Map(Object.entries(item.request.parameters)) : undefined;

        if (item.request.method === "POST") {
            const payload = (item.request.json) ? StringUtils.fillTokens(JSON.stringify(item.request.json), variables) : undefined;
            return HttpRequestHelper.makePOSTRequest(item.name, url, headers, payload, qParams);
        } else if (item.request.method === "PUT") {
            const payload = (item.request.json) ? StringUtils.fillTokens(JSON.stringify(item.request.json), variables) : undefined;
            return HttpRequestHelper.makePUTRequest(item.name, url, headers, payload, qParams);
        } else if (item.request.method === "DELETE") {
            return HttpRequestHelper.makeDELETERequest(item.name, url, headers, qParams);
        }

        return HttpRequestHelper.makeGETRequest(item.name, url, headers, qParams);
    }
}
