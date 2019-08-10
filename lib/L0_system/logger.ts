//------------------------------------------------------------------------------
/**
 * @license
 * Copyright (c) Daniel Pauli <dapaulid@gmail.com>
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
//------------------------------------------------------------------------------

import debug, { Debug } from 'debug';

// string prepended to each trace
const LOGGER_PREFIX = "remo.io";

// predefined log levels
export enum LogLevel {
    FATAL   = 0,
    ERROR   = 1,
    WARN    = 2,
    INFO    = 3,
    DEBUG   = 4,
    VERBOSE = 5,
}

const LOG_LEVELS = [
    /* FATAL  : */ { prefix: 'FATAL', /*color: colors.red,*/ log: 'trace' },
    /* ERROR  : */ { prefix: 'ERROR', /*color: colors.red,*/ log: 'error' },
    /* WARN   : */ { prefix: 'WARN ', /*color: colors.yellow,*/ log: 'warn' },
    /* INFO   : */ { prefix: 'INFO ', /*color: colors.white,*/ log: 'info' },
    /* DEBUG  : */ { prefix: 'DEBUG', /*color: colors.magenta,*/ log: 'log' },
    /* VERBOSE: */ { prefix: 'VERB ', /*color: colors.gray,*/ log: 'log' },
];

export default class Logger {

    public static loglevel: LogLevel = LogLevel.DEBUG;

    constructor(category: string) {
        this.category = category;
        this.dbg = debug(LOGGER_PREFIX + ':' + category);
    }

    protected log(level: LogLevel, message: any, ...optionalParams: any[]) {
        // check log level
        if (level > Logger.loglevel) {
            // filtered
            return;
        }
        // build message
        const ll = LOG_LEVELS[level] || {};
        const prefix = ll.prefix || level.toString();
        const log = ll.log ? (console as any)[ll.log] : console.log;
        const text = LOGGER_PREFIX + ": [ " + prefix + " ] [" + this.category + "] " + message;
        // output message
        log(text, ...optionalParams);
    }

    public fatal(message: any, ...optionalParams: any[]) {
        this.log(LogLevel.FATAL, message, ...optionalParams);
    }

    public error(message: any, ...optionalParams: any[]) {
        this.log(LogLevel.ERROR, message, ...optionalParams);
    }

    public warn(message: any, ...optionalParams: any[]) {
        this.log(LogLevel.WARN, message, ...optionalParams);
    }

    public info(message: any, ...optionalParams: any[]) {
        this.log(LogLevel.INFO, message, ...optionalParams);
    }

    public debug(message: any, ...optionalParams: any[]) {
        this.dbg(message, ...optionalParams);
    }

    public verbose(message: any, ...optionalParams: any[]) {
        this.dbg(message, ...optionalParams);
    }

    private category: string;
    private dbg: debug.Debugger;
}

//------------------------------------------------------------------------------
// end of file
//------------------------------------------------------------------------------
