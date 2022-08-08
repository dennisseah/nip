import sinon, { SinonSandbox, SinonStub } from "sinon";
import fs from "fs";
import { expect } from "chai";
import { JSONUtils } from "../../src/utils/jsonUtils";

describe("JSONUtils fromFile positive unit test", () => {
    const filename = "test.json";
    const data = { hello: "world" };
    const sandbox: SinonSandbox = sinon.createSandbox();

    before(() => {
        sandbox.stub(fs, "existsSync").withArgs(filename).returns(true);
        sandbox.stub(fs, "readFileSync").withArgs(filename).returns(JSON.stringify(data));
    });

    after(() => {
        sandbox.restore();
    });

    it("Get JSON from a file then OK", async () => {
        const result = JSONUtils.fromFile(filename);
        expect(result).to.deep.equal(data);

    });
});

describe("JSONUtils toFile positive unit test", () => {
    const filename = "test.json";
    const data = { hello: "world" };
    const sandbox: SinonSandbox = sinon.createSandbox();
    const cbSpy: SinonStub = sandbox
        .stub(fs, "writeFileSync")
        .withArgs(filename, JSON.stringify(data, null, 4));
        

    after(() => {
        sandbox.restore();
    });

    it("Save JSON to a file then OK", async () => {
        JSONUtils.toFile(data, filename);
        sandbox.assert.calledOnce(cbSpy);
    });
});

describe("JSONUtils fromFile negative unit test", () => {
    const filename = "test.json";
    const sandbox: SinonSandbox = sinon.createSandbox();

    before(() => {
        sandbox.stub(fs, "existsSync").withArgs(filename).returns(false);
    });

    after(() => {
        sandbox.restore();
    })

    it("Get JSON from a file that does not exist then err", async () => {
        expect(() => JSONUtils.fromFile(filename)).to.throw(Error);
    });
});
