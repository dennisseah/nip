import { Logger } from "./logger";
import * as https from "https";
import * as http from "http";

export class HttpRequestHelper {
    static async makeGETRequest(
        name: string,
        url: URL,
        headers?: Map<String, String | Number>,
        parameters?: Map<String, String | Number>
    ): Promise<object> {
        return this.makeRequest(
            name,
            this.createOptions(url, "GET", headers, parameters)
        );
    }
    static async makeDELETERequest(
        name: string,
        url: URL,
        headers?: Map<String, String | Number>,
        parameters?: Map<String, String | Number>
    ): Promise<object> {
        return this.makeRequest(
            name,
            this.createOptions(url, "DELETE", headers, parameters)
        );
    }
    static async makePUTRequest(
        name: string,
        url: URL,
        payload: string | undefined,
        headers?: Map<String, String | Number>,
        parameters?: Map<String, String | Number>
    ): Promise<object> {
        return this.makePOSTPUTRequest(name, "PUT", url, payload, headers, parameters);
    }
    static async makePOSTRequest(
        name: string,
        url: URL,
        payload: string | undefined,
        headers?: Map<String, String | Number>,
        parameters?: Map<String, String | Number>
    ): Promise<object> {
        return this.makePOSTPUTRequest(name, "POST", url, payload, headers, parameters);
    }
    private static async makePOSTPUTRequest(
        name: string,
        method: string,
        url: URL,
        payload: string | undefined,
        headers?: Map<String, String | Number>,
        parameters?: Map<String, String | Number>
    ): Promise<object> {
        if (payload) {
            headers = headers || new Map<String, String>();
            headers.set("Content-Type", "application/json");
            headers.set("Content-Length", payload.length);
        }
        return this.makeRequest(name, this.createOptions(url, method, headers, parameters), payload);
    }
    private static async makeRequest(
        name: string,
        options: https.RequestOptions,
        payload?: string | undefined
    ): Promise<object> {
        return new Promise<object>((resolve, reject) => {
            const req = https.request(options, (res) => {
                const statusCode: number = this.handleResponse(res) || 400;

                if (statusCode > 299) {
                    reject(`problem with request, status code: ${statusCode}`);
                }

                var body = "";
                res.on("data", (chunk) => {
                    body += chunk;
                });

                res.on("end", () => {
                    const contentTypes = (res.headers["content-type"] || "").split(";").map(s => s.toLowerCase());

                    resolve(
                        contentTypes.indexOf("application/json") !== -1 ? JSON.parse(body) : body
                    );
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
    private static handleResponse(res: http.IncomingMessage): number | undefined {
        Logger.debug(`STATUS: ${res.statusCode}`);
        Logger.debug(`HEADERS: ${JSON.stringify(res.headers)}`);
        res.setEncoding("utf8");
        return res.statusCode;
    }
    private static createOptions(
        url: URL,
        method: string,
        headers?: Map<String, String | Number>,
        parameters?: Map<String, String | Number>
    ): https.RequestOptions {
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
}
