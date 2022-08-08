/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { JSONPath, JSONPathOptions } from "jsonpath-plus";

export class Validator {
    static validateStringValue(obj: any, path: string, expectedVal: string) {
        const test = this.matchPath(obj, path)[0] as string;

        if (test !== expectedVal) {
            throw new Error(
                `validateStringValue function failed. expected ${expectedVal} but got ${test}`
            );
        }
    }
    static validateNumericValue(obj: any, path: string, expectedVal: number) {
        const test = this.matchPath(obj, path)[0] as number;

        if (test !== expectedVal) {
            throw new Error(
                `validateNumericValue function failed. expected ${expectedVal} but got ${test}`
            );
        }
    }
    static validateArraySize(obj: any, path: string, expectedVal: number) {
        const test = this.matchPath(obj, path)[0] as Array<any>;

        if (test.length !== expectedVal) {
            throw new Error(
                `validateArraySize function failed. expected ${expectedVal} but got ${test.length}`
            );
        }
    }
    static validateMapValues(obj: any, path: string, valuePath: string, expectedVal: string, all: boolean) {
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
    static validateExist(obj: any, path: string) {
        return this.matchPath(obj, path).length > 0;
    }

    private static matchPath(obj: any, path: string) {
        const target = JSONPath({ path: path, json: obj } as JSONPathOptions);
        if (target.length === 0) {
            throw new Error(
                `validation function failed, path, ${path} does not resolve to any value`
            );
        }
        return target;
    }
}
