import { RequestUtils, WebResponse } from "./requestUtils";

export class HttpRequestHelper {
    public static makeGETRequest(
        name: string,
        url: URL,
        headers?: Map<string, string | number>,
        parameters?: Map<string, string | number>
    ): Promise<WebResponse> {
        return RequestUtils.sendRequest(
            name,
            RequestUtils.createOptions(url, "GET", headers, parameters)
        );
    }
    public static makeDELETERequest(
        name: string,
        url: URL,
        headers?: Map<string, string | number>,
        parameters?: Map<string, string | number>
    ): Promise<WebResponse> {
        return RequestUtils.sendRequest(
            name,
            RequestUtils.createOptions(url, "DELETE", headers, parameters)
        );
    }
    public static makePUTRequest(
        name: string,
        url: URL,
        payload: string | undefined,
        headers?: Map<string, string | number>,
        parameters?: Map<string, string | number>
    ): Promise<WebResponse> {
        return RequestUtils.sendRequest(
            name,
            RequestUtils.createOptions(url, "PUT", headers, parameters, payload),
            payload
        );
    }
    public static makePOSTRequest(
        name: string,
        url: URL,
        payload: string | undefined,
        headers?: Map<string, string | number>,
        parameters?: Map<string, string | number>
    ): Promise<WebResponse> {
        return RequestUtils.sendRequest(
            name,
            RequestUtils.createOptions(url, "POST", headers, parameters, payload),
            payload
        );
    }
}
