/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { JSONPath, JSONPathOptions } from "jsonpath-plus";

export interface ValidateStringValueParameters {
    path: string;
    expectedVal: string;
}
export interface ValidateNumericValueParameters {
    path: string;
    expectedVal: number;
}
export interface ValidateExistParameters {
    path: string;
}

export interface ValidateArraySizeParameters {
    path: string;
    expectedVal: number;
}
export interface ValidateMapValuesParameters {
    path: string;
    valuePath: string;
    expectedVal: string;
    all: boolean;
}

export class Validator {
    static validate(obj: any, type: string, parameters: any): void {
        if (type === "validateStringValue") {
            this.validateStringValue(obj, parameters as ValidateStringValueParameters);
        } else if (type === "validateNumericValue") {
            this.validateNumericValue(obj, parameters as ValidateNumericValueParameters);
        } else if (type === "validateExist") {
            this.validateExist(obj, parameters as ValidateExistParameters);
        } else if (type === "validateArraySize") {
            this.validateArraySize(obj, parameters as ValidateArraySizeParameters);
        } else if (type === "validateMapValues") {
            this.validateMapValues(obj, parameters as ValidateMapValuesParameters);
        } else {
            throw new Error(`Unknown validation type, ${type}`);
        }
    }
    private static validateStringValue(
        obj: any,
        parameters: ValidateStringValueParameters
    ) {
        const path = parameters.path;
        const expectedVal = parameters.expectedVal;
        const test = this.matchPath(obj, path)[0] as string;

        if (test !== expectedVal) {
            throw new Error(
                `validateStringValue function failed. expected ${expectedVal} but got ${test}`
            );
        }
    }
    private static validateNumericValue(obj: any, parameters: ValidateNumericValueParameters) {
        const path = parameters.path;
        const expectedVal = parameters.expectedVal;
        const test = this.matchPath(obj, path)[0] as number;

        if (test !== expectedVal) {
            throw new Error(
                `validateNumericValue function failed. expected ${expectedVal} but got ${test}`
            );
        }
    }
    private static validateArraySize(obj: any, parameters: ValidateArraySizeParameters) {
        const path = parameters.path;
        const expectedVal = parameters.expectedVal;
        const test = this.matchPath(obj, path)[0] as Array<any>;

        if (test.length !== expectedVal) {
            throw new Error(
                `validateArraySize function failed. expected ${expectedVal} but got ${test.length}`
            );
        }
    }
    private static validateMapValues(obj: any, parameters: ValidateMapValuesParameters) {
        const path = parameters.path;
        const valuePath = parameters.valuePath;
        const expectedVal = parameters.expectedVal;
        const all = parameters.all;

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
    private static validateExist(obj: any, parameters: ValidateExistParameters) {
        return this.matchPath(obj, parameters.path).length > 0;
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
