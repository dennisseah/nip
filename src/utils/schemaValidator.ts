import Ajv from "ajv";

export class SchemaValidator {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    public static validate(schema: any, obj: any): string | undefined {
        const ajv = new Ajv({ strict: true, allowUnionTypes: true });
        const result = ajv.validate(schema, obj);
        return result ? undefined : ajv.errorsText();
    }
}
