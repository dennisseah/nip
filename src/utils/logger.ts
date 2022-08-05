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
            console.log(message);
        }
    }
    static debug(message: string): void {
        if (this.level === LogLevel.DEBUG) {
            console.log(message);
        }
    }
    static error(message: string): void {
        if (this.level !== LogLevel.OFF) {
            console.log(message);
        }
    }
}
