import { expect } from "chai";
import {
    ValidateArraySizeParameters,
    ValidateExistParameters,
    ValidateMapValuesParameters,
    ValidateNumericValueParameters,
    ValidateStringValueParameters,
    Validator
} from "../../src/utils/validator";

describe("Validator unit test", () => {
    it("validateStringValue test", () => {
        const data = {
            levelOne: {
                id: "test"
            }
        };
        const path = "$.[levelOne][id]";
        Validator.validate(data, "validateStringValue",
            { path: path, expectedVal: "test" } as ValidateStringValueParameters);

        expect(() => Validator.validate(data, "validateStringValue",
            { path: path, expectedVal: "test1" } as ValidateStringValueParameters)
        ).to.throw(
            Error, "validateStringValue function failed. expected test1 but got test"
        );
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
        Validator.validate(data, "validateNumericValue",
            { path: path, expectedVal: 1 } as ValidateNumericValueParameters);
        expect(() => Validator.validate(data, "validateNumericValue",
            { path: path, expectedVal: 2 } as ValidateNumericValueParameters)
        ).to.throw(
            Error, "validateNumericValue function failed. expected 2 but got 1"
        );
    });
    it("validateArraySize test", () => {
        const data = { items: [0, 1] };
        const path = "$.[items]";
        Validator.validate(data, "validateArraySize",
            { path: path, expectedVal: 2 } as ValidateArraySizeParameters);
        expect(() => Validator.validate(data, "validateArraySize",
            { path: path, expectedVal: 1 } as ValidateArraySizeParameters)
        ).to.throw(
            Error, "validateArraySize function failed. expected 1 but got 2"
        );
    });
    it("validateMapValues test", () => {
        const data = {
            values: {
                hello: { errors: [] },
                world: { errors: [] },
            },
        };
        Validator.validate(data, "validateMapValues",
            { path: "$.[values]", valuePath: "$.errors", expectedVal: "[]", all: true } as ValidateMapValuesParameters);
        expect(() => Validator.validate(data, "validateMapValues",
            { path: "$.[values]", valuePath: "$.errors", expectedVal: "[]", all: false } as ValidateMapValuesParameters)
        ).to.throw(Error);

        const data2 = {
            values: {
                hello: { errors: [] },
                world: { errors: [ "error"] },
            },
        };
        Validator.validate(data2, "validateMapValues",
            { path: "$.[values]", valuePath: "$.errors", expectedVal: "[]", all: false } as ValidateMapValuesParameters)
        expect(() => Validator.validate(data2, "validateMapValues",
            { path: "$.[values]", valuePath: "$.errors", expectedVal: "[]", all: true } as ValidateMapValuesParameters)
        ).to.throw(Error);
    });
    it("validateExist test", () => {
        const data = { values: 1 };
        Validator.validate(data, "validateExist", { path: "$.[values]" } as ValidateExistParameters);
        
        expect(() => Validator.validate(data, "validateExist",
            { path: "$.[valuesX]" } as ValidateExistParameters)
        ).to.throw(
            Error, "validation function failed, path, $.[valuesX] does not resolve to any value"
        );
    });
    it("invalid validation type test", () => {
        const data = { values: 1 };
        expect(() =>
            Validator.validate(data, "unknown", {
                path: "$.[valuesX]",
            } as ValidateExistParameters)
        ).to.throw(Error, "Unknown validation type, unknown");
    });
});
