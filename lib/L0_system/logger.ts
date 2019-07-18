
// string prepended to each trace
const LOGGER_PREFIX = "remo.js: ";

// predefined log levels
export enum LogLevel {
    FATAL   = 0,
    ERROR   = 1,
    WARN    = 2,
    INFO    = 3,
    VERBOSE = 4,
    DEBUG   = 5,
}

const LOG_LEVELS = [
    /* FATAL  : */ { prefix: 'FATAL', /*color: colors.red,*/ log: 'trace' },
    /* ERROR  : */ { prefix: 'ERROR', /*color: colors.red,*/ log: 'error' },
    /* WARN   : */ { prefix: 'WARN ', /*color: colors.yellow,*/ log: 'warn' },
    /* INFO   : */ { prefix: 'INFO ', /*color: colors.white,*/ log: 'info' },
    /* VERBOSE: */ { prefix: 'VERB ', /*color: colors.gray,*/ log: 'log' },
    /* DEBUG  : */ { prefix: 'DEBUG', /*color: colors.magenta,*/ log: 'log' },
];

export default class Logger {

    public static loglevel: LogLevel = LogLevel.DEBUG;

    constructor(category: string) {
        this.category = category;
    }

    protected log(level: LogLevel, text: string) {
        // check log level
        if (level > Logger.loglevel) {
            // filtered
            return;
        }
        // build message
        const ll = LOG_LEVELS[level] || {};
        const prefix = ll.prefix || level.toString();
        const log = ll.log ? (console as any)[ll.log] : console.log;
        const message = LOGGER_PREFIX + "[" + prefix + "] [" + this.category + "] " + text;
        // output message
        log(message);
    }

    public fatal(text: string) {
        this.log(LogLevel.FATAL, text);
    }

    public error(text: string) {
        this.log(LogLevel.ERROR, text);
    }

    public warn(text: string) {
        this.log(LogLevel.WARN, text);
    }

    public info(text: string) {
        this.log(LogLevel.INFO, text);
    }

    public verbose(text: string) {
        this.log(LogLevel.VERBOSE, text);
    }

    public debug(text: string) {
        this.log(LogLevel.DEBUG, text);
    }

    private category: string;
}
