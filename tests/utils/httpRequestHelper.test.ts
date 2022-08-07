import chai from "chai";
import { expect } from "chai";
import nock from "nock";
import { HttpRequestHelper } from "../../src/utils/httpRequestHelper";

chai.should();

describe("HTTP Request Helper unit test", async () => {
    const MOCK_SERVER = "http://www.testnip.com:80";
    const response = { hello: "world" };
    const mockServer = nock(MOCK_SERVER)
        .get("/test")
        .reply(200, response, { "content-type": "application/json" });
const result = await HttpRequestHelper.makeGETRequest(
    "test",
    new URL(`${MOCK_SERVER}/test`)
);
    done();
    
    it("GET HTTP test", async () => {
        expect(result).equal(response);
    });
});
