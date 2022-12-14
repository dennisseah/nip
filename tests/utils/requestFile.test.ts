import { expect } from "chai";
import sinon, { SinonSandbox } from "sinon";
import { RequestFile } from "../../src/utils/requestFile";
import { JSONUtils } from "../../src/utils/jsonUtils";
import { YAMLUtils } from "../../src/utils/yamlUtils";

describe("RequestFile set identifier for json file unit test", () => {
    const filename = "test.json";
    const data = {
        hello: "world",
        steps: [
            {
                name: "Fetch Products",
                request: {
                    url: "http://test.com",
                    method: "GET",
                },
            },
        ],
    };
    const sandbox: SinonSandbox = sinon.createSandbox();

    before(() => {
        sandbox.stub(JSONUtils, "fromFile").withArgs(filename).returns(data);
        sandbox.stub(JSONUtils, "toFile").withArgs(filename, sinon.match.any);
    });

    after(() => {
        sandbox.restore();
    });

    it("set identifier", async () => {
        const result = RequestFile.fetch(filename);
        expect(result.id).not.undefined;
        expect(result.id).not.null;
    });
});

describe("RequestFile set identifier for yaml file unit test", () => {
    const filename = "test.yaml";
    const data = {
        hello: "world",
        steps: [
            {
                name: "Fetch Products",
                request: {
                    url: "http://test.com",
                    method: "GET",
                },
            },
        ],
    };
    const sandbox: SinonSandbox = sinon.createSandbox();

    before(() => {
        sandbox.stub(YAMLUtils, "fromFile").withArgs(filename).returns(data);
        sandbox.stub(YAMLUtils, "toFile").withArgs(filename, sinon.match.any);
    });

    after(() => {
        sandbox.restore();
    });

    it("set identifier", async () => {
        const result = RequestFile.fetch(filename);
        expect(result.id).not.undefined;
        expect(result.id).not.null;
    });
});

describe("RequestFile when identifier already exist unit test", () => {
    const filename = "test.json";
    const data = {
        id: "test",
        hello: "world",
        steps: [
            {
                name: "Fetch Products",
                request: {
                    url: "http://test.com",
                    method: "GET",
                },
            },
        ],
    };

    const sandbox: SinonSandbox = sinon.createSandbox();

    before(() => {
        sandbox.stub(JSONUtils, "fromFile").withArgs(filename).returns(data);
        sandbox.stub(JSONUtils, "toFile").withArgs(filename, sinon.match.any);
    });

    after(() => {
        sandbox.restore();
    });

    it("identifier already exist", async () => {
        const result = RequestFile.fetch(filename);
        expect(result.id).equal("test");
    });
});

describe("RequestFile when data file is invalid unit test", () => {
    const filename = "test.json";
    const data = { id: "test", hello: "world" }; // missing steps
    const sandbox: SinonSandbox = sinon.createSandbox();

    before(() => {
        sandbox.stub(JSONUtils, "fromFile").withArgs(filename).returns(data);
        sandbox.stub(JSONUtils, "toFile").withArgs(filename, sinon.match.any);
    });

    after(() => {
        sandbox.restore();
    });

    it("invalid test spec", async () => {
        expect(() => RequestFile.fetch(filename)).to.throw(
            Error,
            "Schema error: data must have required property 'steps"
        );
    });
});

describe("RequestFile when data file has invalid extension unit test", () => {
    const filename = "test.x";

    it("identifier file extension", async () => {
        expect(() => RequestFile.fetch(filename)).to.throw(
            Error,
            `Invalid file extension ${filename}`
        );
    });
});
