//------------------------------------------------------------------------------
/**
 * @license
 * Copyright (c) Daniel Pauli <dapaulid@gmail.com>
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
//------------------------------------------------------------------------------

interface IErrorDesc {
    label: string;
    code: number;
    text: string;
}

// error class used for all library specific errors
export default class RemoError extends Error implements IErrorDesc {

    constructor(err: IErrorDesc, details?: any) {
        // format error message
        const message = '[' + err.label + '] '
            + substitute(err.text, details)
            + ' (code ' + formatErrorCode(err.code) + ')';
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

function substitute(s: string, subst: any): string {
    return s.replace(/\${\w+}/g, (m: string) => {
        const placeholder = m.substring(2, m.length - 1);
        return subst[placeholder] || m;
    });
}

//------------------------------------------------------------------------------
// end of file
//------------------------------------------------------------------------------
