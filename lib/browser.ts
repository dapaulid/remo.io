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

import { ClientEndpoint, RemoteEndpoint } from './L4_rcp';

/** creates a new client instance */
export function createClient(): ClientEndpoint {
    return new ClientEndpoint();
}

/** default client instance */
export const client: ClientEndpoint = createClient();

/** default server stub */
export let server: RemoteEndpoint | null = null;

/** accessor for default server using promise */
export function getServer(): Promise<RemoteEndpoint> {
    if (server == null) {
        return client.connect().then((srv) => {
            server = srv;
            return server;
        });
    } else {
        return Promise.resolve(server);
    }
}

//------------------------------------------------------------------------------
// end of file
//------------------------------------------------------------------------------
