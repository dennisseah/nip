import { expect } from "chai";
import { WebResponse } from "../../src/utils/requestUtils";
import {
    ValidateArraySizeParameters,
    ValidateBooleanValueParameters,
    ValidateExistParameters,
    ValidateHTTPCodeParameters,
    ValidateMapValuesParameters,
    ValidateNumericValueParameters,
    ValidateStringValueParameters,
    Validator,
} from "../../src/utils/validator";

describe("Validator unit test", () => {
    it("validateStringValue test", () => {
        const data = {
            levelOne: {
                id: "test",
            },
        };
        const path = "$.[levelOne][id]";
        Validator.validate(new WebResponse(200, data), "validateStringValue", {
            path: path,
            expectedVal: "test",
        } as ValidateStringValueParameters);

        expect(() =>
            Validator.validate(
                new WebResponse(200, data),
                "validateStringValue",
                {
                    path: path,
                    expectedVal: "test1",
                } as ValidateStringValueParameters
            )
        ).to.throw(
            Error,
            "validateStringValue function failed. expected test1 but got test"
        );
    });
    it("validateNumericValue test", () => {
        const data = {
            levelOne: {
                sub: {
                    val: 1,
                },
            },
        };
        const path = "$.[levelOne][sub[val]";
        Validator.validate(new WebResponse(200, data), "validateNumericValue", {
            path: path,
            expectedVal: 1,
        } as ValidateNumericValueParameters);
        expect(() =>
            Validator.validate(
                new WebResponse(200, data),
                "validateNumericValue",
                {
                    path: path,
                    expectedVal: 2,
                } as ValidateNumericValueParameters
            )
        ).to.throw(
            Error,
            "validateNumericValue function failed. expected 2 but got 1"
        );
    });
    it("validateBooleanValue test", () => {
        const data = {
            levelOne: {
                sub: {
                    val: true,
                },
            },
        };
        const path = "$.[levelOne][sub[val]";
        Validator.validate(new WebResponse(200, data), "validateBooleanValue", {
            path: path,
            expectedVal: true,
        } as ValidateBooleanValueParameters);
        expect(() =>
            Validator.validate(
                new WebResponse(200, data),
                "validateBooleanValue",
                {
                    path: path,
                    expectedVal: false,
                } as ValidateBooleanValueParameters
            )
        ).to.throw(
            Error,
            "validateBooleanValue function failed. expected false but got true"
        );
    });

    it("validateHTTPCode test", () => {
        Validator.validate(new WebResponse(200, {}), "validateHTTPCode", {
            expectedVal: 200,
        } as ValidateHTTPCodeParameters);

        expect(() =>
            Validator.validate(new WebResponse(404, {}), "validateHTTPCode", {
                expectedVal: 200,
            } as ValidateHTTPCodeParameters)
        ).to.throw(
            Error,
            "validateHTTPCode function failed. expected 200 but got 404"
        );
    });
    it("validateArraySize test", () => {
        const data = { items: [0, 1] };
        const path = "$.[items]";
        Validator.validate(new WebResponse(200, data), "validateArraySize", {
            path: path,
            expectedVal: 2,
        } as ValidateArraySizeParameters);
        expect(() =>
            Validator.validate(
                new WebResponse(200, data),
                "validateArraySize",
                {
                    path: path,
                    expectedVal: 1,
                } as ValidateArraySizeParameters
            )
        ).to.throw(
            Error,
            "validateArraySize function failed. expected 1 but got 2"
        );
    });
    it("validateMapValues test", () => {
        const data = {
            values: {
                hello: { errors: [] },
                world: { errors: [] },
            },
        };
        Validator.validate(new WebResponse(200, data), "validateMapValues", {
            path: "$.[values]",
            valuePath: "$.errors",
            expectedVal: "[]",
            all: true,
        } as ValidateMapValuesParameters);
        expect(() =>
            Validator.validate(
                new WebResponse(200, data),
                "validateMapValues",
                {
                    path: "$.[values]",
                    valuePath: "$.errors",
                    expectedVal: "[]",
                    all: false,
                } as ValidateMapValuesParameters
            )
        ).to.throw(Error);

        const data2 = {
            values: {
                hello: { errors: [] },
                world: { errors: ["error"] },
            },
        };
        Validator.validate(new WebResponse(200, data2), "validateMapValues", {
            path: "$.[values]",
            valuePath: "$.errors",
            expectedVal: "[]",
            all: false,
        } as ValidateMapValuesParameters);
        expect(() =>
            Validator.validate(
                new WebResponse(200, data2),
                "validateMapValues",
                {
                    path: "$.[values]",
                    valuePath: "$.errors",
                    expectedVal: "[]",
                    all: true,
                } as ValidateMapValuesParameters
            )
        ).to.throw(Error);
    });
    it("validateExist test", () => {
        const data = { values: 1 };
        Validator.validate(new WebResponse(200, data), "validateExist", {
            path: "$.[values]",
        } as ValidateExistParameters);

        expect(() =>
            Validator.validate(new WebResponse(200, data), "validateExist", {
                path: "$.[valuesX]",
            } as ValidateExistParameters)
        ).to.throw(
            Error,
            "validation function failed, path, $.[valuesX] does not resolve to any value"
        );
    });
    it("invalid validation type test", () => {
        const data = { values: 1 };
        expect(() =>
            Validator.validate(new WebResponse(200, data), "unknown", {
                path: "$.[valuesX]",
            } as ValidateExistParameters)
        ).to.throw(Error, "Unknown validation type, unknown");
    });
});
