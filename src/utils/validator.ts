import { JSONPath, JSONPathOptions } from "jsonpath-plus";

export class Validator {
    static validateStringValue(obj: object, path: string, expectedVal: string) {
        const test = this.matchPath(obj, path)[0] as string;

        if (test !== expectedVal) {
            throw new Error(
                `validateStringValue function failed. expected ${expectedVal} but got ${test}`
            );
        }
    }
    static validateNumericValue(
        obj: object,
        path: string,
        expectedVal: number
    ) {
        const test = this.matchPath(obj, path)[0] as number;

        if (test !== expectedVal) {
            throw new Error(
                `validateNumericValue function failed. expected ${expectedVal} but got ${test}`
            );
        }
    }
    static validateArraySize(obj: object, path: string, expectedVal: number) {
        const test = this.matchPath(obj, path)[0] as Array<object>;

        if (test.length !== expectedVal) {
            throw new Error(`validateArraySize function failed. expected ${expectedVal} but got ${test.length}`);
        }
    }
    static validateMapValues(
        obj: object,
        path: string,
        valuePath: string,
        expectedVal: string,
        all: boolean = true
    ) {
        const target = this.matchPath(obj, path);

        const allMatch = Object.values(target[0]).every((val) => {
            const mapVal = JSONPath({
                path: valuePath,
                json: val,
            } as JSONPathOptions);
            return (
                mapVal.length === 1 && expectedVal === JSON.stringify(mapVal[0])
            );
        });

        if (allMatch !== all) {
            throw new Error("validateMapValues function failed");
        }
    }
    static validateExist(obj: object, path: string) {
        return this.matchPath(obj, path).length > 0;
    }

    private static matchPath(obj: object, path: string) {
        const target = JSONPath({ path: path, json: obj } as JSONPathOptions);
        if (target.length === 0) {
            throw new Error(
                `validation function failed, path, ${path} does not resolve to any value`
            );
        }
        return target;
    }
}
