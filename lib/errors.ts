import * as L1 from './L1_transport/errors';

interface IErrorDesc {
    label: string;
    code: number;
    text: string;
}

// error class used for all library specific errors
class RemoError extends Error implements IErrorDesc {

    constructor(err: IErrorDesc, details?: any) {
        // format error message
        const message = '[' + err.label + '] ' + err.text + ' (code ' + formatErrorCode(err.code) + ')';
        // call base
        super(message);
        // set properties
        this.name = "RemoError";
        this.label = err.label;
        this.code = err.code;
        this.text = err.text;
        this.details = details;
    }

    public label: string;
    public code: number;
    public text: string;
    public details: any;
}

function formatErrorCode(code: number) {
    return '0x' + ("00000000" + code.toString(16).toUpperCase()).substr(-8);
}

export { RemoError, L1 };
