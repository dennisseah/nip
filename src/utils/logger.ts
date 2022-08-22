export enum LogLevel {
    ERROR,
    INFO,
    DEBUG,
    OFF,
}

export class Logger {
    private static level = LogLevel.INFO;

    public static parseLevel(level: string): LogLevel {
        if ("error" === level) {
            return LogLevel.ERROR;
        }
        if ("info" === level) {
            return LogLevel.INFO;
        }
        if ("debug" === level) {
            return LogLevel.DEBUG;
        }
        if ("off" === level) {
            return LogLevel.OFF;
        }
        throw new Error(`Unknown log level, ${level}`);
    }
    public static setLevel(level: LogLevel): void {
        this.level = level;
    }
    public static getLevel(): LogLevel {
        return this.level;
    }
    public static log(message: string): void {
        if (this.level !== LogLevel.OFF) {
            console.log(`\x1b[32m${message}\x1b[89m\x1b[0m`);
        }
    }
    public static debug(message: string): void {
        if (this.level === LogLevel.DEBUG) {
            console.log(`\x1b[33m${message}\x1b[89m\x1b[0m`);
        }
    }
    public static error(message: string): void {
        if (this.level !== LogLevel.OFF) {
            console.log(`\x1b[31m${message}\x1b[89m\x1b[0m`);
        }
    }
}
