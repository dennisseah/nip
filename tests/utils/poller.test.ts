import { expect } from "chai";
import {Poller } from "../../src/utils/poller";

describe("Poller unit test", () => {
    it("bool_true test", () => {
        const data = {
            val: true
        };
        expect(Poller.poll(data, "bool_true", "$.[val]")).true;
    });
    it("bool_true negative test", () => {
        const data = {
            val: false,
        };
        expect(Poller.poll(data, "bool_true", "$.[val]")).false;
    });
    it("bool_true missing path test", () => {
        const data = {
            val: true,
        };
        expect(() => Poller.poll(data, "bool_true")).to.throw(Error, "Missing path");
    });
    it("bool_false test", () => {
        const data = {
            val: false,
        };
        expect(Poller.poll(data, "bool_false", "$.[val]")).true;
    });
    it("bool_false negative test", () => {
        const data = {
            val: true,
        };
        expect(Poller.poll(data, "bool_false", "$.[val]")).false;
    });
    it("bool_false missing path test", () => {
        const data = {
            val: true,
        };
        expect(() => Poller.poll(data, "bool_false")).to.throw(
            Error,
            "Missing path"
        );
    });
    it("empty_list test", () => {
        expect(Poller.poll([], "empty_list", "$.[val]")).true;
    });
    it("empty_list negative test", () => {
        expect(Poller.poll(["a"], "empty_list", "$.[val]")).false;
    });
    it("empty_list negative (not array) test", () => {
        expect(Poller.poll("a", "empty_list", "$.[val]")).false;
    });
    it("invalid type test", () => {
        const data = {
            val: [],
        };
        expect(() => Poller.poll(data, "invalid", "$.[val]")).to.throw(
            Error, "Unknown poll type, invalid"
        );
    });
});
