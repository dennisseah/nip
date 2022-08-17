import { JSONUtils } from "./jsonUtils";
import { Request } from "../request";
import { SchemaValidator } from "./schemaValidator";
import { YAMLUtils } from "./yamlUtils";

import { v4 as uuidv4 } from 'uuid';
import * as path from "path";

export class RequestFile {
    private static schema = JSONUtils.fromFile(path.join(".", "schema.json"));

    static fetch(path: string): Request {
        const data = this.fetchData(path) as Request;
        const error = SchemaValidator.validate(this.schema, data);

        if (error) {
            throw new Error(`Schema error: ${error}`);
        }

        if (path.endsWith(".json")) {
            JSONUtils.toFile(data, path);
        } else {
            YAMLUtils.toFile(data, path);
        }
        return data;
    }

    private static fetchData(path: string) {
        if (path.endsWith(".json") || path.endsWith(".yaml")) {
            const data = path.endsWith(".json") ? JSONUtils.fromFile(path) : YAMLUtils.fromFile(path);
            if (!data.id) {
                data.id = uuidv4();
            }
            return data;
        }
        throw new Error(`Invalid file extension ${path}`);
    }
}