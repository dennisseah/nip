import { expect } from "chai";
import sinon, { SinonSandbox, SinonStub } from "sinon";
import { Logger, LogLevel } from "../../src/utils/logger";

describe("Logger unit test", () => {
    it("get default log level", () => {
        const level = Logger.getLevel();
        expect(level).equal(LogLevel.INFO);
    });
    it("set log level", () => {
        Logger.setLevel(LogLevel.DEBUG);
        const level = Logger.getLevel();
        expect(level).equal(LogLevel.DEBUG);
    });
    it("parse log error level", () => {
        expect(Logger.parseLevel("error")).equal(LogLevel.ERROR);
    });
    it("parse log info level", () => {
        expect(Logger.parseLevel("info")).equal(LogLevel.INFO);
    });
    it("parse log debug level", () => {
        expect(Logger.parseLevel("debug")).equal(LogLevel.DEBUG);
    });
    it("parse log off level", () => {
        expect(Logger.parseLevel("off")).equal(LogLevel.OFF);
    });
    it("parse log invalid level", () => {
        expect(() => Logger.parseLevel("error1")).to.throw(Error, "Unknown log level, error1");
    });
});

describe("Logger debug unit test", () => {
    const sandbox: SinonSandbox = sinon.createSandbox();
    let spyConsoleLog: SinonStub;

    before(() => {
        spyConsoleLog = sandbox.stub(console, "log");
    });

    after(() => {
        sandbox.restore();
    });

    it("debug test no console log", () => {
        Logger.setLevel(LogLevel.OFF);
        Logger.debug("test");
        sinon.assert.notCalled(spyConsoleLog);
    });

    it("debug test", () => {
        Logger.setLevel(LogLevel.DEBUG);
        Logger.debug("test");
        sinon.assert.calledWithExactly(spyConsoleLog, "\x1b[33mtest\x1b[89m\x1b[0m");
    });
});

describe("Logger log unit test", () => {
    const sandbox: SinonSandbox = sinon.createSandbox();
    let spyConsoleLog: SinonStub;

    before(() => {
        spyConsoleLog = sandbox.stub(console, "log");
    });

    after(() => {
        sandbox.restore();
    });

    it("log test no console log", () => {
        Logger.setLevel(LogLevel.OFF);
        Logger.log("test");
        sinon.assert.notCalled(spyConsoleLog);
    });

    it("log test", () => {
        Logger.setLevel(LogLevel.INFO);
        Logger.log("test");
        sinon.assert.calledWithExactly(spyConsoleLog, "\x1b[32mtest\x1b[89m\x1b[0m");
    });
});

describe("Logger error unit test", () => {
    const sandbox: SinonSandbox = sinon.createSandbox();
    let spyConsoleLog: SinonStub;

    before(() => {
        spyConsoleLog = sandbox.stub(console, "log");
    });

    after(() => {
        sandbox.restore();
    });

    it("error test no console log", () => {
        Logger.setLevel(LogLevel.OFF);
        Logger.error("test");
        sinon.assert.notCalled(spyConsoleLog);
    });

    it("log test", () => {
        Logger.setLevel(LogLevel.INFO);
        Logger.error("test");
        sinon.assert.calledWithExactly(spyConsoleLog, "\x1b[31mtest\x1b[89m\x1b[0m");
    });
});