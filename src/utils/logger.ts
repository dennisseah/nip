export enum LogLevel {
    ERROR,
    INFO,
    DEBUG,
    OFF,
}

export class Logger {
    private static level = LogLevel.INFO;

    static setLevel(level: string): void {
        if (!level) {
            return;
        }
        if ("error" === level) {
            this.level = LogLevel.ERROR;
        } else if ("info" === level) {
            this.level = LogLevel.INFO;
        } else if ("debug" === level) {
            this.level = LogLevel.DEBUG;
        } else if ("off" === level) {
            this.level = LogLevel.OFF;
        } else {
            throw new Error(`Unknown log level, ${level}`);
        }
    }
    static log(message: string): void {
        if (this.level !== LogLevel.OFF) {
            console.log(`\x1b[32m${message}\x1b[89m`);
            console.log("\x1b[0m");
        }
    }
    static debug(message: string): void {
        if (this.level === LogLevel.DEBUG) {
            console.log(`\x1b[33m${message}\x1b[89m`);
            console.log("\x1b[0m");
        }
    }
    static error(message: string): void {
        if (this.level !== LogLevel.OFF) {
            console.log(`\x1b[31m${message}\x1b[89m`);
            console.log("\x1b[0m");
        }
    }
}
