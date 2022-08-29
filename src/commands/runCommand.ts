import { Helper } from "../utils/helper";
import { HttpRequestHelper } from "../utils/httpRequestHelper";
import { Logger } from "../utils/logger";
import { RequestFile } from "../utils/requestFile";
import { StringUtils } from "../utils/stringUtils";
import { TestCommandBase } from "./testCommandBase";
import { WebResponse } from "../utils/requestUtils";

import { Command } from "commander";
import { Promise } from "bluebird";
import * as path from "path";
import * as request from "../request";

export class RunCommand extends TestCommandBase {
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
    protected async perform(): Promise<void> {
        const dataDir = this.getOptionString("datadir", path.join(".", "data"));
        const filename = this.getOptionString("filename");
        const teardown = this.getOptionBoolean("teardown");
        const restart = this.getOptionBoolean("restart");

        const data = RequestFile.fetch(path.join(dataDir, filename));
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const testSpecId = data.id!;

        data.variables = this.loadVariables(testSpecId, data.variables, restart);

        if (data.authentication && data.authentication.apiKeys) {
            data.authentication.apiKeys = new Map(Object.entries(data.authentication.apiKeys));
        }

        const steps = teardown ? data.teardowns : data.steps;

        if (steps) {
            Promise.mapSeries(steps, (item: request.RequestItem) =>
                this.createStep(item, data, teardown)
            )
                .then(() => {
                    Logger.log("completed all the steps");
                    this.dumpVariables(testSpecId, data.variables);
                })
                .catch((rejection) => {
                    console.error(`Fail to run all the steps, ${rejection}`);
                    this.dumpVariables(testSpecId, data.variables);
                });
        }
    }
    private async createStep(
        item: request.RequestItem,
        data: request.Request,
        ignoreError: boolean
    ): Promise<string> {
        try {
            Logger.log(`run step: ${item.name}`);
            let completed = false;

            while (!completed) {
                this.populateVariables(item.preRequestVariables, data.variables);
                await this.performStep(item, data);
                completed = this.repeat(item.repeat, data.variables);
            }

            return "completed";
        } catch (ex) {
            if (ignoreError) {
                return (ex as Error).message;
            }
            throw ex;
        }
    }
    private async performStep(item: request.RequestItem, data: request.Request): Promise<void> {
        let completed = false;

        while (!completed) {
            const response = await this.makeRequest(item, data.authentication, data.variables);
            const responseBody = response.body;
            Logger.debug(JSON.stringify(responseBody, null, 2));
            completed = this.polling(responseBody, item.poll);

            if (completed) {
                // completed polling
                if (responseBody) {
                    Logger.log(JSON.stringify(responseBody, null, 2));
                }
                this.validate(response, item.validations, data.variables);
                this.extractVariables(data.variables, responseBody, item.variables);
            } else {
                Logger.log(`wait for ${item.poll.durationInSeconds} seconds...`);
                await Helper.sleep(item.poll.durationInSeconds * 1000);
            }
        }
    }
    private makeRequest(
        item: request.RequestItem,
        authentication: request.RequestAuthentication,
        variables: Map<string, string>
    ): Promise<WebResponse> {
        const url = new URL(StringUtils.fillTokens(item.request.url, variables));
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
                ? StringUtils.fillTokens(JSON.stringify(item.request.json), variables)
                : undefined;
            return HttpRequestHelper.makePOSTRequest(item.name, url, payload, headers, qParams);
        }
        if (item.request.method === "PUT") {
            const payload = item.request.json
                ? StringUtils.fillTokens(JSON.stringify(item.request.json), variables)
                : undefined;
            return HttpRequestHelper.makePUTRequest(item.name, url, payload, headers, qParams);
        }
        if (item.request.method === "DELETE") {
            return HttpRequestHelper.makeDELETERequest(item.name, url, headers, qParams);
        }

        return HttpRequestHelper.makeGETRequest(item.name, url, headers, qParams);
    }
}
