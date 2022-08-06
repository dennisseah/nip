import { JSONPath, JSONPathOptions } from "jsonpath-plus";

export class Validator {
    static validateStringValue(obj: object, path: string, expectedVal: string) {
        const target = JSONPath({ path: path, json: obj } as JSONPathOptions);
        if (target.length === 0) {
            throw new Error("validateStringValue function failed");
        }

        const test = target[0] as string;

        if (test !== expectedVal) {
            throw new Error("validateStringValue function failed");
        }
    }
    static validateArraySize(obj: object, path: string, expectedVal: number) {
        const target = JSONPath({ path: path, json: obj } as JSONPathOptions);
        if (target.length === 0) {
            throw new Error("validateArraySize function failed");
        }

        const test = target[0] as Array<object>;

        if (test.length !== expectedVal) {
            throw new Error("validateArraySize function failed");
        }
    }
    static validateMapValues(
        obj: object,
        path: string,
        valuePath: string,
        expectedVal: string,
        all: boolean
    ) {
        const target = JSONPath({ path: path, json: obj } as JSONPathOptions);
        if (target.length === 0) {
            throw new Error("validateMapValues function failed");
        }

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
        const target = JSONPath({ path: path, json: obj } as JSONPathOptions);
        return target.length > 0;
    }
}
