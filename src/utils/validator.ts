/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { JSONPath, JSONPathOptions } from "jsonpath-plus";
import { WebResponse } from "./requestUtils";
import { StringUtils } from "./stringUtils";

export interface ValidateStringValueParameters {
    path: string;
    expectedVal: string;
}
export interface ValidateNumericValueParameters {
    path: string;
    expectedVal: number;
}

export interface ValidateBooleanValueParameters {
    path: string;
    expectedVal: boolean;
}

export interface ValidateHTTPCodeParameters {
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
    static validate(
        obj: WebResponse,
        type: string,
        parameters: any,
        variables: Map<string, string> = new Map()
    ) {
        if (type === "validateStringValue") {
            this.validateStringValue(
                obj,
                parameters as ValidateStringValueParameters,
                variables
            );
        } else if (type === "validateNumericValue") {
            this.validateNumericValue(
                obj,
                parameters as ValidateNumericValueParameters
            );
        } else if (type === "validateBooleanValue") {
            this.validateBooleanValue(
                obj,
                parameters as ValidateBooleanValueParameters
            );
        } else if (type === "validateHTTPCode") {
            this.validateHTTPCode(
                obj,
                parameters as ValidateHTTPCodeParameters
            );
        } else if (type === "validateExist") {
            this.validateExist(obj, parameters as ValidateExistParameters);
        } else if (type === "validateArraySize") {
            this.validateArraySize(
                obj,
                parameters as ValidateArraySizeParameters
            );
        } else if (type === "validateMapValues") {
            this.validateMapValues(
                obj,
                parameters as ValidateMapValuesParameters
            );
        } else {
            throw new Error(`Unknown validation type, ${type}`);
        }
    }
    private static validateStringValue(
        response: WebResponse,
        parameters: ValidateStringValueParameters,
        variables: Map<string, string>
    ) {
        const path = parameters.path;
        const expectedVal = StringUtils.fillTokens(
            parameters.expectedVal,
            variables
        );
        const test = this.matchPath(response.body, path)[0] as string;

        if (test !== expectedVal) {
            throw new Error(
                `validateStringValue function failed. expected ${expectedVal} but got ${test}`
            );
        }
    }
    private static validateNumericValue(
        response: WebResponse,
        parameters: ValidateNumericValueParameters
    ) {
        const path = parameters.path;
        const expectedVal = parameters.expectedVal;
        const test = this.matchPath(response.body, path)[0] as number;

        if (test !== expectedVal) {
            throw new Error(
                `validateNumericValue function failed. expected ${expectedVal} but got ${test}`
            );
        }
    }
    private static validateBooleanValue(
        response: WebResponse,
        parameters: ValidateBooleanValueParameters
    ) {
        const path = parameters.path;
        const expectedVal = parameters.expectedVal;
        const test = this.matchPath(response.body, path)[0] as boolean;

        if (test !== expectedVal) {
            throw new Error(
                `validateBooleanValue function failed. expected ${expectedVal} but got ${test}`
            );
        }
    }
    private static validateHTTPCode(
        response: WebResponse,
        parameters: ValidateHTTPCodeParameters
    ) {
        const expectedVal = parameters.expectedVal;

        if (response.statusCode !== expectedVal) {
            throw new Error(
                `validateHTTPCode function failed. expected ${expectedVal} but got ${response.statusCode}`
            );
        }
    }
    private static validateArraySize(
        response: WebResponse,
        parameters: ValidateArraySizeParameters
    ) {
        const path = parameters.path;
        const expectedVal = parameters.expectedVal;
        const test = this.matchPath(response.body, path)[0] as Array<any>;

        if (test.length !== expectedVal) {
            throw new Error(
                `validateArraySize function failed. expected ${expectedVal} but got ${test.length}`
            );
        }
    }
    private static validateMapValues(
        response: WebResponse,
        parameters: ValidateMapValuesParameters
    ) {
        const path = parameters.path;
        const valuePath = parameters.valuePath;
        const expectedVal = parameters.expectedVal;
        const all = parameters.all;

        const target = this.matchPath(response.body, path);

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
    private static validateExist(
        response: WebResponse,
        parameters: ValidateExistParameters
    ) {
        return this.matchPath(response.body, parameters.path).length > 0;
    }

    private static matchPath(obj: any, path: string) {
        const target = JSONPath({
            path: path,
            json: obj,
        } as JSONPathOptions);
        if (target.length === 0) {
            throw new Error(
                `validation function failed, path, ${path} does not resolve to any value`
            );
        }
        return target;
    }
}
