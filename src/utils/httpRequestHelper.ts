import { RequestUtils } from "./requestUtils";

export class HttpRequestHelper {
    static async makeGETRequest(
        name: string,
        url: URL,
        headers?: Map<string, string | number>,
        parameters?: Map<string, string | number>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ): Promise<any> {
        return RequestUtils.sendRequest(name, RequestUtils.createOptions(url, "GET", headers, parameters));
    }
    static async makeDELETERequest(
        name: string,
        url: URL,
        headers?: Map<string, string | number>,
        parameters?: Map<string, string | number>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ): Promise<any> {
        return RequestUtils.sendRequest(name, RequestUtils.createOptions(url, "DELETE", headers, parameters));
    }
    static async makePUTRequest(
        name: string,
        url: URL,
        payload: string | undefined,
        headers?: Map<string, string | number>,
        parameters?: Map<string, string | number>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ): Promise<any> {
        return RequestUtils.sendRequest(name, RequestUtils.createOptions(url, "PUT", headers, parameters, payload), payload);
    }
    static async makePOSTRequest(
        name: string,
        url: URL,
        payload: string | undefined,
        headers?: Map<string, string | number>,
        parameters?: Map<string, string | number>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ): Promise<any> {
        return RequestUtils.sendRequest(name, RequestUtils.createOptions(url, "POST", headers, parameters, payload), payload);
    }
}
