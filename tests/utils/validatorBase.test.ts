import { expect } from "chai";
import { WebResponse } from "../../src/utils/requestUtils";
import { ValidatorBase } from "../../src/utils/validators/validatorBase";

describe("ValidatorBase unit test", () => {
    it("validate function not implemented", () => {
        const validator = new ValidatorBase();

        expect(() =>
            validator.validate(
                new WebResponse(200, { values: 1 }),
                {},
                new Map()
            )
        ).to.throw(Error, "not implemented");
    });
});
