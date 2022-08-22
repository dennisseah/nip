import { assert, expect } from "chai";
import { RequestOptions } from "https";
import nock from "nock";
import { RequestUtils } from "../../src/utils/requestUtils";

describe("RequestUtils createOptions unit test", () => {
    it("sanity test", () => {
        const headers = new Map();
        headers.set("h1", "1");
        const parameters = new Map();
        parameters.set("p1", "one");

        const options = RequestUtils.createOptions(
            new URL("https://sample.com:8080/test"),
            "GET",
            headers,
            parameters
        );
        expect(options.hostname).equal("sample.com");
        expect(options.port).equal("8080");
        expect(options.path).equal("/test?p1=one");
        expect(options.method).equal("GET");
        if (options.headers) {
            expect(options.headers["h1"]).equal("1");
        } else {
            assert(false);
        }
    });
    it("POST with payload test", () => {
        const headers = new Map();
        const parameters = new Map();

        const options = RequestUtils.createOptions(
            new URL("https://sample.com:8080/test"),
            "POST",
            headers,
            parameters,
            JSON.stringify({ hello: "world" })
        );
        expect(options.hostname).equal("sample.com");
        expect(options.port).equal("8080");
        expect(options.method).equal("POST");
        if (options.headers) {
            expect(options.headers["Content-Type"]).equal("application/json");
            expect(options.headers["Content-Length"]).equal(17);
        } else {
            assert(false);
        }
    });
});

const createMockOptions = (url: URL, method: string, payload?: string): RequestOptions => {
    const headers = new Map();
    const parameters = new Map();

    return RequestUtils.createOptions(url, method, headers, parameters, payload);
};

describe("RequestUtils sendRequest unit test", () => {
    it("error case", async () => {
        const url = new URL("https://sample.com:8080/test");
        nock("https://sample.com:8080").get("/test").query({}).reply(400);

        const resp = await RequestUtils.sendRequest("test", createMockOptions(url, "GET"));
        expect(resp.statusCode).equal(400);
        expect(resp.body).be.undefined;
    });
    it("valid GET request", async () => {
        const url = new URL("https://sample.com:8080/test");
        nock("https://sample.com:8080").get("/test").query({}).reply(200, { hello: "world" });

        const resp = await RequestUtils.sendRequest("test", createMockOptions(url, "GET"));
        expect(resp.statusCode).equal(200);
        expect(resp.body["hello"]).equals("world");
    });
    it("valid POST request", async () => {
        const payload = JSON.stringify({ a: "1" });
        const url = new URL("https://sample.com:8080/test");
        nock("https://sample.com:8080").post("/test").query({}).reply(201, { hello: "world" });

        const resp = await RequestUtils.sendRequest(
            "test",
            createMockOptions(url, "POST", payload),
            payload
        );
        expect(resp.statusCode).equal(201);
        expect(resp.body["hello"]).equals("world");
    });
    it("connection error", async () => {
        const url = new URL("https://sample.com:8080/test");
        nock("https://sample.com:8080").get("/test").query({}).replyWithError("err:connection");

        let err: Error | undefined;
        try {
            await RequestUtils.sendRequest("test", createMockOptions(url, "GET"));
        } catch (error) {
            err = error as Error;
        }

        expect(err).not.undefined;
    });
});
