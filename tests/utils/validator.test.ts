import { expect } from "chai";
import { Validator } from "../../src/utils/validator";

describe("Validator unit test", () => {
    it("validateStringValue test", () => {
        const data = {
            levelOne: {
                id: "test"
            }
        };
        const path = "$.[levelOne][id]";
        Validator.validateStringValue(data, path, "test");

        expect(() => Validator.validateStringValue(data, path, "test1")).to.throw(
            Error, "validateStringValue function failed. expected test1 but got test");
    });
    it("validateNumericValue test", () => {
        const data = {
            levelOne: {
                sub: {
                    val: 1
                }
            }
        };
        const path = "$.[levelOne][sub[val]";
        Validator.validateNumericValue(data, path, 1);
        expect(() => Validator.validateNumericValue(data, path, 2)).to.throw(
            Error, "validateNumericValue function failed. expected 2 but got 1");
    });
    it("validateArraySize test", () => {
        const data = { items: [0, 1] };
        const path = "$.[items]";
        Validator.validateArraySize(data, path, 2);
        expect(() => Validator.validateArraySize(data, path, 1)).to.throw(
            Error, "validateArraySize function failed. expected 1 but got 2");
    });
    it("validateMapValues test", () => {
        const data = {
            values: {
                hello: { errors: [] },
                world: { errors: [] },
            },
        };
        Validator.validateMapValues(data, "$.[values]", "$.errors", "[]");
        expect(() => Validator.validateMapValues(data, "$.[values]", "$.errors", "[]", false)).to.throw(Error);

        const data2 = {
            values: {
                hello: { errors: [] },
                world: { errors: [ "error"] },
            },
        };
        Validator.validateMapValues(data2, "$.[values]", "$.errors", "[]", false);
        expect(() => Validator.validateMapValues(data2, "$.[values]", "$.errors", "[]")).to.throw(Error);
    });
    it("validateExist test", () => {
        const data = { values: 1 };
        Validator.validateExist(data, "$.[values]");
        expect(() => Validator.validateExist(data, "$.[valuesX]")).to.throw(
            Error,
            "validation function failed, path, $.[valuesX] does not resolve to any value"
        );
    });
});
