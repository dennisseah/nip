import sinon, { SinonSandbox, SinonStub } from "sinon";
import fs from "fs";
import { expect } from "chai";
import { YAMLUtils } from "../../src/utils/yamlUtils";

describe("YAMLUtils fromFile positive unit test", () => {
    const filename = "test.yaml";
    const raw = "hello: world";
    const sandbox: SinonSandbox = sinon.createSandbox();

    before(() => {
        sandbox.stub(fs, "existsSync").withArgs(filename).returns(true);
        sandbox.stub(fs, "readFileSync").withArgs(filename).returns(raw);
    });

    after(() => {
        sandbox.restore();
    });

    it("Get object from a file then OK", async () => {
        const result = YAMLUtils.fromFile(filename);
        const data = { hello: "world" };
        expect(result).to.deep.equal(data);
    });
});

describe("YAMLUtils toFile positive unit test", () => {
    const filename = "test.json";
    const sandbox: SinonSandbox = sinon.createSandbox();
    let cbSpy: SinonStub;

    before(() => {
        cbSpy = sandbox
            .stub(fs, "writeFileSync")
            .withArgs(filename, sinon.match.string);
    });

    after(() => {
        sandbox.restore();
    });

    it("Save object to a file then OK", async () => {
        const data = { hello: "world" };
        YAMLUtils.toFile(data, filename);
        sandbox.assert.calledOnce(cbSpy);
    });
});

describe("YAMLUtils fromFile negative unit test", () => {
    const filename = "test.json";
    const sandbox: SinonSandbox = sinon.createSandbox();

    before(() => {
        sandbox.stub(fs, "existsSync").withArgs(filename).returns(false);
    });

    after(() => {
        sandbox.restore();
    });

    it("Get object from a file that does not exist then err", async () => {
        expect(() => YAMLUtils.fromFile(filename)).to.throw(Error);
    });
});
