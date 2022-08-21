import { Logger } from "./logger";
import * as https from "https";
import * as http from "http";
export class WebResponse {
    public statusCode: number | undefined;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public body?: any;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    public constructor(statusCode: number, body?: any) {
        this.statusCode = statusCode;
        this.body = body;
    }
}
export class RequestUtils {
    static async sendRequest(
        name: string,
        options: https.RequestOptions,
        payload?: string | undefined
    ): Promise<WebResponse> {
        return new Promise<WebResponse>((resolve, reject) => {
            const req = https.request(options, (res) => {
                const statusCode: number = this.handleResponse(res) || 400;

                if (statusCode > 299) {
                    resolve(new WebResponse(statusCode));
                }

                let body = "";
                res.on("data", (chunk) => {
                    body += chunk;
                });

                res.on("end", () => {
                    const resp = this.isJSONBody(res) ? JSON.parse(body) : body;
                    resolve(new WebResponse(statusCode, resp));
                });
            });
            req.on("error", (e) => {
                reject(`problem with request, ${name}: ${e.message}`);
            });

            if (payload) {
                req.write(payload);
            }
            req.end();
        });
    }
    static createOptions(
        url: URL,
        method: string,
        headers?: Map<string, string | number>,
        parameters?: Map<string, string | number>,
        payload?: string | undefined
    ): https.RequestOptions {
        if (payload) {
            headers = headers || new Map<string, string>();
            headers.set("Content-Type", "application/json");
            headers.set("Content-Length", payload.length);
        }
        const options = {
            hostname: url.hostname,
            port: url.port,
            path: url.pathname,
            method: method,
            rejectUnauthorized: false,
            headers: headers ? Object.fromEntries(headers) : {},
        } as https.RequestOptions;

        if (parameters) {
            const qParams = [...parameters.keys()].map(
                (k) => `${k}=${encodeURIComponent(parameters.get(k) as string)}`
            );
            options.path += "?" + qParams.join("&");
        }

        return options;
    }
    private static handleResponse(res: http.IncomingMessage): number | undefined {
        Logger.debug(`STATUS: ${res.statusCode}`);
        Logger.debug(`HEADERS: ${JSON.stringify(res.headers)}`);
        res.setEncoding("utf8");
        return res.statusCode;
    }
    private static isJSONBody(res: http.IncomingMessage): boolean {
        const contentTypes = (res.headers["content-type"] || "")
            .split(";")
            .map((s) => s.toLowerCase());
        return contentTypes.indexOf("application/json") !== -1;
    }
}
