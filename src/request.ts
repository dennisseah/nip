import { ArraySizeParameters } from "./utils/validators/arraySize";
import { BooleanValueEqParameters } from "./utils/validators/booleanValueEq";
import { ExistParameters } from "./utils/validators/exist";
import { ExistNullParameters } from "./utils/validators/existNull";
import { HTTPStatusCodeEqParameters } from "./utils/validators/httpStatusCodeEq";
import { MapValuesParameters } from "./utils/validators/mapValues";
import { NumericValueEqParameters } from "./utils/validators/numericValueEq";
import { StringValueEqParameters } from "./utils/validators/stringValueEq";

export type HttpTypes = "GET" | "POST" | "PUT" | "DELETE";

export interface RequestItemRequest {
    url: string;
    method: HttpTypes;
    headers: Map<string, string | number>;
    parameters?: Map<string, string | number>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    json?: any;
}

export interface RequestItemRepeat {
    counterVariable: string;
    total: number;
}

export interface RequestItemPoll {
    type: "bool_true" | "bool_false" | "empty_list";
    path?: string;
}

export interface RequestItemValidation {
    type:
        | "mapValues"
        | "stringValueEq"
        | "NumericValueEq"
        | "booleanValueEq"
        | "httpStatusCodeEq"
        | "arraySize"
        | "exist"
        | "existNull";
    parameters:
        | MapValuesParameters
        | StringValueEqParameters
        | NumericValueEqParameters
        | BooleanValueEqParameters
        | HTTPStatusCodeEqParameters
        | ArraySizeParameters
        | ExistParameters
        | ExistNullParameters;
}

export interface RequestItem {
    name: string;
    request: RequestItemRequest;
    preRequestVariables: Map<string, string>;
    repeat: RequestItemRepeat;
    variables: Map<string, string>;
    poll: RequestItemPoll;
    validations: RequestItemValidation[];
}

export interface RequestAuthentication {
    apiKeys?: Map<string, string>;
}

export interface Request {
    id?: string;
    steps: RequestItem[];
    teardowns: RequestItem[];
    authentication: RequestAuthentication;
    variables: Map<string, string>;
}
