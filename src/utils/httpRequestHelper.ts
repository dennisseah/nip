/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestUtils } from "./requestUtils";

export class HttpRequestHelper {
    static makeGETRequest(
        name: string,
        url: URL,
        headers?: Map<string, string | number>,
        parameters?: Map<string, string | number>
    ): Promise<any> {
        return RequestUtils.sendRequest(name, RequestUtils.createOptions(url, "GET", headers, parameters));
    }
    static makeDELETERequest(
        name: string,
        url: URL,
        headers?: Map<string, string | number>,
        parameters?: Map<string, string | number>
    ): Promise<any> {
        return RequestUtils.sendRequest(name, RequestUtils.createOptions(url, "DELETE", headers, parameters));
    }
    static makePUTRequest(
        name: string,
        url: URL,
        payload: string | undefined,
        headers?: Map<string, string | number>,
        parameters?: Map<string, string | number>
    ): Promise<any> {
        return RequestUtils.sendRequest(name, RequestUtils.createOptions(url, "PUT", headers, parameters, payload), payload);
    }
    static makePOSTRequest(
        name: string,
        url: URL,
        payload: string | undefined,
        headers?: Map<string, string | number>,
        parameters?: Map<string, string | number>
    ): Promise<any> {
        return RequestUtils.sendRequest(name, RequestUtils.createOptions(url, "POST", headers, parameters, payload), payload);
    }
}
