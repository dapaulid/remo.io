//------------------------------------------------------------------------------
/**
 * @license
 * Copyright (c) Daniel Pauli <dapaulid@gmail.com>
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
//------------------------------------------------------------------------------

import LocalEndpoint from './localendpoint';
import RemoteEndpoint from './remoteendpoint';

import * as L1 from '../L1_transport';
import * as L0 from '../L0_system';

// create logger
const logger = new L0.Logger("L4:ClientEndpoint");

export default class ClientEndpoint extends LocalEndpoint {

    constructor() {
        super();
    }

    public connect(url?: string): Promise<RemoteEndpoint> {
        const socket = new L1.ClientSocket_SIO(url);
        socket.connect();

        return this.createRemoteEndpoint(socket);
    }

}

//------------------------------------------------------------------------------
// end of file
//------------------------------------------------------------------------------
