import sinon, { SinonSandbox, SinonStub } from "sinon";
import { expect } from "chai";
import fs from "fs";
import * as path from "path";
import * as os from "os";
import { VariableCache } from "../../src/utils/variableCache";

const id = "test";
const mockData = new Map<string, string>([
    ["var1", "val1"],
    ["var2", "val2"],
]);
const cacheDir = path.join(os.homedir(), VariableCache.FOLDER_NAME);
const filename = path.join(cacheDir, id);


describe("VariableCache fetch unit test", () => {
    const sandbox: SinonSandbox = sinon.createSandbox();

    before(() => {
        sandbox.stub(fs, "existsSync").withArgs(sinon.match.string).returns(true);
        sandbox
            .stub(fs, "readFileSync")
            .withArgs(filename)
            .returns(JSON.stringify(Object.fromEntries(mockData)));
    });

    after(() => {
        sandbox.restore();
    });

    it("fetch without id", () => {
        const cache = VariableCache.fetch(undefined);
        expect(cache.keys.length).equal(0);
    });
    it("fetch with id", () => {
        const cache = VariableCache.fetch(id);
        expect(cache.keys).equal(mockData.keys);
        expect(cache.values).equal(mockData.values);
    });
});

describe("VariableCache fetch when cache dir does not exist unit test", () => {
    const sandbox: SinonSandbox = sinon.createSandbox();

    let spyReadFileSync: SinonStub;
    let spyMkdirSync: SinonStub;

    before(() => {
        sandbox.stub(fs, "existsSync").withArgs(sinon.match.string).returns(false);
        spyReadFileSync = sandbox.stub(fs, "readFileSync").withArgs(filename).returns(JSON.stringify(Object.fromEntries(mockData)));
        spyMkdirSync = sandbox.stub(fs, "mkdirSync").withArgs(cacheDir);
    });

    after(() => {
        sandbox.restore();
    });

    it("fetch with id when cache dir does not exist", () => {
        const cache = VariableCache.fetch(id);
        expect(cache.keys.length).equal(0);
        sinon.assert.notCalled(spyReadFileSync);
        sinon.assert.calledOnce(spyMkdirSync);
    });
});

describe("VariableCache clear unit test", () => {
    const sandbox: SinonSandbox = sinon.createSandbox();

    let spyExistSync: SinonStub;
    let spyUnlinkSync: SinonStub;

    before(() => {
        spyExistSync = sandbox.stub(fs, "existsSync").withArgs(sinon.match.string).returns(true);
        spyUnlinkSync = sandbox.stub(fs, "unlinkSync").withArgs(filename);
    });

    after(() => {
        sandbox.restore();
    });

    it("clear without id", () => {
        VariableCache.clear(undefined);
        sandbox.assert.notCalled(spyExistSync);
    });
    it("clear with id", () => {
        VariableCache.clear(id);
        sandbox.assert.calledOnce(spyUnlinkSync);
    });
});

describe("VariableCache clear when cache does not exist unit test", () => {
    const sandbox: SinonSandbox = sinon.createSandbox();
    let spyUnlinkSync: SinonStub;

    before(() => {
        sandbox.stub(fs, "existsSync").withArgs(sinon.match.string).returns(false);
        spyUnlinkSync = sandbox.stub(fs, "unlinkSync").withArgs(filename);
    });

    after(() => {
        sandbox.restore();
    });

    it("clear with id when cache does not exist", () => {
        VariableCache.clear(id);
        sandbox.assert.notCalled(spyUnlinkSync);
    });
});

describe("VariableCache store unit test", () => {
    const sandbox: SinonSandbox = sinon.createSandbox();

    let spyExistSync: SinonStub;
    let spyUnlinkSync: SinonStub;
    let spyWriteFileSync: SinonStub;

    before(() => {
        spyExistSync = sandbox.stub(fs, "existsSync").withArgs(cacheDir).returns(true);
        spyUnlinkSync = sandbox.stub(fs, "unlinkSync").withArgs(filename);
        spyWriteFileSync = sandbox.stub(fs, "writeFileSync").withArgs(filename, sinon.match.string);

    });

    after(() => {
        sandbox.restore();
    });

    it("store without id", () => {
        VariableCache.store(undefined, mockData);
        sandbox.assert.notCalled(spyWriteFileSync);
    });

    it("store with id", () => {
        VariableCache.store(id, mockData);
        sandbox.assert.calledOnce(spyWriteFileSync);
    });
});
