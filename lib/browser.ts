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
 * This file is the entry point for browserify and populates the global "remo"
 * object in the browser.
 */

import { ClientEndpoint } from './L2_application';

/** creates a new client instance */
export function createClient(): ClientEndpoint {
    return new ClientEndpoint();
}

/** default client instance */
export const client = createClient();

/** default server stub */
export const server = client.connect();

//------------------------------------------------------------------------------
// end of file
//------------------------------------------------------------------------------
