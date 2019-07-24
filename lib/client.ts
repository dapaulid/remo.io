//------------------------------------------------------------------------------
/**
 * @license
 * Copyright (c) Daniel Pauli <dapaulid@gmail.com>
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
//------------------------------------------------------------------------------

import * as L2 from './L2_application';

console.log("Powered by remo.js");

const client = new L2.ClientEndpoint();
export let server = connect();

export function connect(url?: string | null): L2.RemoteEndpoint {
    const remote = client.connect(url);
    remote.callFunction("hansli", { gugus: 1234 }, 777).then((result) => {
        console.log("Function on server completed: " + JSON.stringify(result));
    }).catch((err) => {
        console.log("Function on server failed: " + err);
    });
    return remote;
}

//------------------------------------------------------------------------------
// end of file
//------------------------------------------------------------------------------
