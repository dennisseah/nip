export type HttpTypes = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface RequestItemRequest {
    url: string;
    method: HttpTypes;
    headers: Map<String, String | Number>;
    parameters?: Map<String, String | Number>;
    json?: object;
}

export interface RequestItemPoll {
    type: "bool_true" | "bool_false" | "empty_list";
    path?: string;
}

export interface ValidateStringValueParameters {
    path: string;
    expectedVal: string;
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

export interface ValidateExistParameters {
    path: string;
}

export interface RequestItemValidation {
    type: "validateMapValues" | "validateStringValue" | "validateArraySize" | "validateExist";
    parameters: ValidateMapValuesParameters | ValidateStringValueParameters | validateArraySizeParameters | ValidateExistParameters;
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