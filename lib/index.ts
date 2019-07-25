//------------------------------------------------------------------------------
/**
 * @license
 * Copyright (c) Daniel Pauli <dapaulid@gmail.com>
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
//------------------------------------------------------------------------------

/**
 * This file is the entry point for node.js
 */

import * as L2 from './L2_application';

/** creates a new server instance */
export function createServer(options: L2.IServerEndpointOptions): L2.ServerEndpoint {
    return new L2.ServerEndpoint(options);
}

/** creates a new client instance */
export function createClient(): L2.ClientEndpoint {
    return new L2.ClientEndpoint();
}

//------------------------------------------------------------------------------
// end of file
//------------------------------------------------------------------------------
