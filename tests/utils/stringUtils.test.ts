import { expect } from "chai";
import { StringUtils } from "../../src/utils/stringUtils";

describe("StringUtils unit test", () => {
    const variables: Map<string, string> = new Map<string, string>([
        ["token1", "hello"],
        ["token2", "world"],
        ["token3", "!"],
    ]);

    it("fill randomInt", () => {
        const result = StringUtils.fillTokens("{{$randomInt}}", variables);
        expect(parseInt(result, 10)).greaterThan(0);
    });
    it("fill invalid generator value", () => {
        const result = StringUtils.fillTokens("{{$unknown}}", variables);
        expect(result).equals("{{$unknown}}");
    });
    it("fill none", () => {
        const result = StringUtils.fillTokens("test", variables);
        expect(result).equal("test");
    });
    it("fill one", () => {
        const result = StringUtils.fillTokens("test {{token1}}", variables);
        expect(result).equal("test hello");
    });
    it("fill two", () => {
        const result = StringUtils.fillTokens(
            "{{token2}} test {{token1}}",
            variables
        );
        expect(result).equal("world test hello");
    });
    it("fill three", () => {
        const result = StringUtils.fillTokens(
            "{{token2}} test {{token1}}{{token3}}",
            variables
        );
        expect(result).equal("world test hello!");
    });
});
