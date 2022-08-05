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
    type: "validateMapValues" | "validateExist";
    parameters: ValidateMapValuesParameters | ValidateExistParameters;
}

export interface RequestItem {
    name: string;
    request: RequestItemRequest;
    variables: Map<String, String>;
    poll: RequestItemPoll;
    validations: RequestItemValidation[];
}

export interface RequestAuthentication {
    apiKeys?: Map<String, String>;
}

export interface Request {
    steps: RequestItem[];
    teardowns: RequestItem[];
    authentication: RequestAuthentication;
    variables: Map<String, String>;
}