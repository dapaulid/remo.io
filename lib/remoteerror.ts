//------------------------------------------------------------------------------
/**
 * @license
 * Copyright (c) Daniel Pauli <dapaulid@gmail.com>
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
//------------------------------------------------------------------------------

// error class used for generic errors occurred on a remote host
export default class RemoteError extends Error {

    constructor(message: string, details?: any) {
        // call base
        super(message);
        // set properties
        this.name = "RemoteError";
        this.details = details;
    }

    public details: any;
}

//------------------------------------------------------------------------------
// end of file
//------------------------------------------------------------------------------
