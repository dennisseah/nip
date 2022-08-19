import { assert, expect } from "chai";
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
