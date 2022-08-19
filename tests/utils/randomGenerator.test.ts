import { expect } from "chai";
import { RandomGenerator } from "../../src/utils/randomGenerator";

describe("RandomGenerator unit test", () => {
    it("sanity test", () => {
        const randInt = RandomGenerator.generate("randomInt") || "-1";
        expect(parseInt(randInt, 10)).greaterThan(0);
        expect(parseInt(randInt, 10)).lessThan(101);

        const randColor = RandomGenerator.generate("randomColor") || "";
        expect(randColor in RandomGenerator.colors);
    });
    it("randomInt test", () => {
        const result = RandomGenerator.randomInt(1, 100);
        expect(result).greaterThan(0);
        expect(result).lessThan(101);
    });
    it("randomColor test", () => {
        const result = RandomGenerator.randomColor();
        expect(result in RandomGenerator.colors);
    });
});
