/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { WebResponse } from "./requestUtils";
import { ArraySize } from "./validators/arraySize";
import { BooleanValueEq } from "./validators/booleanValueEq";
import { Exist } from "./validators/exist";
import { ExistNull } from "./validators/existNull";
import { HTTPStatusCodeEq } from "./validators/httpStatusCodeEq";
import { MapValues } from "./validators/mapValues";
import { NumericValueEq } from "./validators/numericValueEq";
import { StringValueEq } from "./validators/stringValueEq";
import { ValidatorBase } from "./validators/validatorBase";

export class Validator {
    private static mappings: { [key: string]: typeof ValidatorBase } = {
        stringValueEq: StringValueEq,
        numericValueEq: NumericValueEq,
        booleanValueEq: BooleanValueEq,
        httpStatusCodeEq: HTTPStatusCodeEq,
        exist: Exist,
        existNull: ExistNull,
        arraySize: ArraySize,
        mapValues: MapValues,
    };

    static validate(
        obj: WebResponse,
        type: string,
        parameters: any,
        variables: Map<string, string> = new Map()
    ) {
        if (type in this.mappings) {
            const validator = new this.mappings[type]();
            validator.validate(obj, parameters, variables);
        } else {
            throw new Error(`Unknown validation type, ${type}`);
        }
    }
}
