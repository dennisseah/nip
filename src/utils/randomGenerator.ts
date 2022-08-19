export class RandomGenerator {
    static colors = [
        "aqua",
        "azure",
        "beige",
        "black",
        "blue",
        "brown",
        "cyan",
        "darkblue",
        "darkcyan",
        "darkgrey",
        "darkgreen",
        "darkkhaki",
        "darkmagenta",
        "darkolivegreen",
        "darkorange",
        "darkorchid",
        "darkred",
        "darksalmon",
        "darkviolet",
        "fuchsia",
        "gold",
        "green",
        "indigo",
        "khaki",
        "lightblue",
        "lightcyan",
        "lightgreen",
        "lightgrey",
        "lightpink",
        "lightyellow",
        "lime",
        "magenta",
        "maroon",
        "navy",
        "olive",
        "orange",
        "pink",
        "purple",
        "violet",
        "red",
        "silver",
        "white",
        "yellow",
    ];

    static generate(name: string): string | null {
        if (name === "randomInt") {
            return this.randomInt().toString();
        }
        if (name === "randomColor") {
            return this.randomColor();
        }
        return null;
    }
    static randomInt(min = 1, max = 100): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    static randomColor(): string {
        const len = this.colors.length;
        return this.colors[this.randomInt(0, len - 1)];
    }
}
