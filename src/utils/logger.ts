export enum LogLevel {
    ERROR,
    INFO,
    DEBUG,
    OFF,
}

export class Logger {
    private static level = LogLevel.INFO;

    static parseLevel(level: string): LogLevel {
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

    static setLevel(level: LogLevel): void {
        if (level) {
            this.level = level;
        }
    }
    static log(message: string): void {
        if (this.level !== LogLevel.OFF) {
            console.log(`\x1b[32m${message}\x1b[89m\x1b[0m`);
        }
    }
    static debug(message: string): void {
        if (this.level === LogLevel.DEBUG) {
            console.log(`\x1b[33m${message}\x1b[89m\x1b[0m`);
        }
    }
    static error(message: string): void {
        if (this.level !== LogLevel.OFF) {
            console.log(`\x1b[31m${message}\x1b[89m\x1b[0m`);
        }
    }
}
