import { JSONUtils } from "./jsonUtils";
import { Request } from "../request";
import { v4 as uuidv4 } from 'uuid';

export class RequestFile {
    static fetch(path: string): Request {
        const data = JSONUtils.fromFile(path) as Request;
        if (!data.id) {
            data.id = uuidv4();
        }
        JSONUtils.toFile(data, path);
        return data;
    }
}