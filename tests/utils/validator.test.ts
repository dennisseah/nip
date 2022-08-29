import { expect } from "chai";
import { WebResponse } from "../../src/utils/requestUtils";
import { Validator } from "../../src/utils/validator";

describe("Validator unit test", () => {
    it("stringValueEq test", () => {
        const data = {
            levelOne: {
                id: "test",
            },
        };
        const path = "$.[levelOne][id]";
        Validator.validate(new WebResponse(200, data), "stringValueEq", {
            path: path,
            expectedVal: "test",
        });

        expect(() =>
            Validator.validate(new WebResponse(200, data), "stringValueEq", {
                path: path,
                expectedVal: "test1",
            })
        ).to.throw(Error, "StringValueEq validation failed. expected test1 but got test");
    });
    it("numericValueEq test", () => {
        const data = {
            levelOne: {
                sub: {
                    val: 1,
                },
            },
        };
        const path = "$.[levelOne][sub[val]";
        Validator.validate(new WebResponse(200, data), "numericValueEq", {
            path: path,
            expectedVal: 1,
        });
        expect(() =>
            Validator.validate(new WebResponse(200, data), "numericValueEq", {
                path: path,
                expectedVal: 2,
            })
        ).to.throw(Error, "numericValueEq validation failed. expected 2 but got 1");
    });
    it("booleanValueEq test", () => {
        const data = {
            levelOne: {
                sub: {
                    val: true,
                },
            },
        };
        const path = "$.[levelOne][sub[val]";
        Validator.validate(new WebResponse(200, data), "booleanValueEq", {
            path: path,
            expectedVal: true,
        });
        expect(() =>
            Validator.validate(new WebResponse(200, data), "booleanValueEq", {
                path: path,
                expectedVal: false,
            })
        ).to.throw(Error, "booleanValueEq validation failed. expected false but got true");
    });

    it("httpStatusCodeEq test", () => {
        Validator.validate(new WebResponse(200, {}), "httpStatusCodeEq", {
            expectedVal: 200,
        });

        expect(() =>
            Validator.validate(new WebResponse(404, {}), "httpStatusCodeEq", {
                expectedVal: 200,
            })
        ).to.throw(Error, "httpStatusCodeEq validation failed. expected 200 but got 404");
    });
    it("arraySize test", () => {
        const data = { items: [0, 1] };
        const path = "$.[items]";
        Validator.validate(new WebResponse(200, data), "arraySize", {
            path: path,
            expectedVal: 2,
        });
        expect(() =>
            Validator.validate(new WebResponse(200, data), "arraySize", {
                path: path,
                expectedVal: 1,
            })
        ).to.throw(Error, "arraySize validation failed. expected 1 but got 2");
    });
    it("mapValues test", () => {
        const data = {
            values: {
                hello: { errors: [] },
                world: { errors: [] },
            },
        };
        Validator.validate(new WebResponse(200, data), "mapValues", {
            path: "$.[values]",
            valuePath: "$.errors",
            expectedVal: "[]",
            all: true,
        });
        expect(() =>
            Validator.validate(new WebResponse(200, data), "mapValues", {
                path: "$.[values]",
                valuePath: "$.errors",
                expectedVal: "[]",
                all: false,
            })
        ).to.throw(Error);

        const data2 = {
            values: {
                hello: { errors: [] },
                world: { errors: ["error"] },
            },
        };
        Validator.validate(new WebResponse(200, data2), "mapValues", {
            path: "$.[values]",
            valuePath: "$.errors",
            expectedVal: "[]",
            all: false,
        });
        expect(() =>
            Validator.validate(new WebResponse(200, data2), "mapValues", {
                path: "$.[values]",
                valuePath: "$.errors",
                expectedVal: "[]",
                all: true,
            })
        ).to.throw(Error);
    });
    it("exist test", () => {
        const data = { values: 1 };
        Validator.validate(new WebResponse(200, data), "exist", {
            path: "$.[values]",
        });

        expect(() =>
            Validator.validate(new WebResponse(200, { values: null }), "exist", {
                path: "$.[values]",
            })
        ).to.throw(Error, "exist validation failed.");

        expect(() =>
            Validator.validate(new WebResponse(200, data), "exist", {
                path: "$.[valuesX]",
            })
        ).to.throw(
            Error,
            "validation function failed, path, $.[valuesX] does not resolve to any value"
        );
    });
    it("existNull test", () => {
        const data = { values: null };
        Validator.validate(new WebResponse(200, data), "existNull", {
            path: "$.[values]",
        });

        expect(() =>
            Validator.validate(new WebResponse(200, { values: 1 }), "existNull", {
                path: "$.[values]",
            })
        ).to.throw(Error, "existNull validation failed.");

        Validator.validate(new WebResponse(200, { value: null }), "existNull", {
            path: "$.[values]",
        });
    });
    it("invalid validation type test", () => {
        const data = { values: 1 };
        expect(() =>
            Validator.validate(new WebResponse(200, data), "unknown", {
                path: "$.[valuesX]",
            })
        ).to.throw(Error, "Unknown validation type, unknown");
    });
});
