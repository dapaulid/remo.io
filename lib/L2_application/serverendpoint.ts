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
const logger = new L0.Logger("L2:ServerEndpoint");

export default class ServerEndpoint extends LocalEndpoint {

    constructor(options: L1.ISocketServerOptions) {
        super();
        this.server = new L1.SocketServer_SIO(options);
        this.server.onconnected = this.connected.bind(this);
        // TODO disconnect?
    }

    protected connected(socket: L1.ISocket): void {
        this.createRemoteEndpoint(socket);
    }

    protected server: L1.ISocketServer;

}

//------------------------------------------------------------------------------
// end of file
//------------------------------------------------------------------------------
