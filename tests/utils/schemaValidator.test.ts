import { expect } from "chai";
import * as path from "path";
import { JSONUtils } from "../../src/utils/jsonUtils";
import { SchemaValidator } from "../../src/utils/schemaValidator";

describe("SchemaValidator unit test", () => {
    const schema = JSONUtils.fromFile(path.join(".", "schema.json"));

    it("positive test", () => {
        const data = JSONUtils.fromFile(path.join(".", "data", "sample.json"));
        expect(SchemaValidator.validate(schema, data)).undefined;
    });

    it("negative test", () => {
        const data = JSONUtils.fromFile(path.join(".", "data", "sample.json"));
        delete data.steps;
        expect(SchemaValidator.validate(schema, data)).equals(
            "data must have required property 'steps'"
        );
    });
});
