import {
    ValidateArraySizeParameters,
    ValidateExistParameters,
    ValidateHTTPCodeParameters,
    ValidateMapValuesParameters,
    ValidateNumericValueParameters,
    ValidateBooleanValueParameters,
    ValidateStringValueParameters,
} from "./utils/validator";

export type HttpTypes = "GET" | "POST" | "PUT" | "DELETE";

export interface RequestItemRequest {
    url: string;
    method: HttpTypes;
    headers: Map<string, string | number>;
    parameters?: Map<string, string | number>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    json?: any;
}

export interface RequestItemPoll {
    type: "bool_true" | "bool_false" | "empty_list";
    path?: string;
}

export interface RequestItemValidation {
    type:
        | "validateMapValues"
        | "validateStringValue"
        | "validateNumericValue"
        | "validateBooleanValue"
        | "validateHTTPCode"
        | "validateArraySize"
        | "validateExist";
    parameters:
        | ValidateMapValuesParameters
        | ValidateStringValueParameters
        | ValidateNumericValueParameters
        | ValidateBooleanValueParameters
        | ValidateHTTPCodeParameters
        | ValidateArraySizeParameters
        | ValidateExistParameters;
}

export interface RequestItem {
    name: string;
    request: RequestItemRequest;
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
