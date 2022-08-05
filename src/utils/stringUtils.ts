export class StringUtils {
    static fillTokens(str: string, variables: Map<string, string>): string {
        [...variables.keys()].forEach((k) => {
            str = str.replace(
                new RegExp("{{" + k + "}}", "g"),
                variables.get(k) as string
            );
        });
        return str;
    }
}
