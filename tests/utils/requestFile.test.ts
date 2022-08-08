import { expect } from "chai";
import sinon, { SinonSandbox, SinonStub } from "sinon";
import { RequestFile } from "../../src/utils/requestFile";
import { JSONUtils } from "../../src/utils/jsonUtils";

describe("RequestFile set identifier unit test", () => {
    const filename = "test.json";
    const data = { hello: "world" };
    const sandbox: SinonSandbox = sinon.createSandbox();

    before(() => {
        sandbox.stub(JSONUtils, "fromFile").withArgs(filename).returns(data);
    });

    after(() => {
        sandbox.restore();
    })

    it("set identifier", async () => {
        const result = RequestFile.fetch(filename);
        expect(result.id).not.undefined;
        expect(result.id).not.null;
    });
});


describe("RequestFile when identifier already exist unit test", () => {
    const filename = "test.json";
    const data = { id: "test", hello: "world" };
    const sandbox: SinonSandbox = sinon.createSandbox();

    before(() => {
        sandbox.stub(JSONUtils, "fromFile").withArgs(filename).returns(data);
    });

    after(() => {
        sandbox.restore();
    });

    it("identifier already exist", async () => {
        const result = RequestFile.fetch(filename);
        expect(result.id).equal("test");
    });
});