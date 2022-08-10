import { JSONUtils } from "./jsonUtils";
import { Request } from "../request";
import { SchemaValidator } from "./schemaValidator";

import { v4 as uuidv4 } from 'uuid';
import * as path from "path";

export class RequestFile {
    private static schema = JSONUtils.fromFile(path.join(".", "schema.json"));

    static fetch(path: string): Request {
        const data = JSONUtils.fromFile(path) as Request;
        if (!data.id) {
            data.id = uuidv4();
        }
        const error = SchemaValidator.validate(this.schema, data);

        if (error) {
            throw new Error(`Schema error: ${error}`);
        }

        JSONUtils.toFile(data, path);
        return data;
    }
}