//------------------------------------------------------------------------------
/**
 * @license
 * Copyright (c) Daniel Pauli <dapaulid@gmail.com>
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
//------------------------------------------------------------------------------

import * as L4 from './L4_rcp/errors';
import * as L3 from './L3_presentation/errors';
import * as L1 from './L1_transport/errors';
import RemoError from './remoerror';
import RemoteError from './remoteerror';

export { RemoError, L1, L3, L4 };

export function revive(err: any): Error {
    if (err && err.name === "RemoError") {
        // error in our library
        return new RemoError({ label: err.label, code: err.code, text: err.text }, err.details);
    } else {
        // unknown error
        return new RemoteError(err.message || err.toString(), err);
    }
}

export function serialize(err: any) {
    if (err instanceof Error) {
        const ser = Object.assign({}, err);
        // assign non-enumerable (?) properties
        ser.message = err.message;
        return ser;
    } else {
        // as is
        return err;
    }
}

//------------------------------------------------------------------------------
// end of file
//------------------------------------------------------------------------------
