import { RandomGenerator } from "./randomGenerator";
export class StringUtils {
    public static fillTokens(str: string, variables: Map<string, string>): string {
        str = str.replace(new RegExp("{{.+?}}", "g"), (test) => {
            if (test.startsWith("{{$") && test.endsWith("}}")) {
                const val = RandomGenerator.generate(test.substring(3, test.length - 2));
                return val || test;
            }
            return test;
        });
        [...variables.keys()].forEach((k) => {
            str = str.replace(new RegExp("{{" + k + "}}", "g"), variables.get(k) as string);
        });
        return str;
    }
}
