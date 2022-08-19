export class RandomGenerator {
    static generate(name: string): string | null {
        if (name === "randomInt") {
            return this.randomInt().toString();
        }
        return null;
    }
    static randomInt(min = 1, max = 100): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
