//------------------------------------------------------------------------------
/**
 * @license
 * Copyright (c) Daniel Pauli <dapaulid@gmail.com>
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
//------------------------------------------------------------------------------

import io from 'socket.io';

import SocketServer from './socketserver';
import ServerSocket_SIO from './serversocket-sio';
import * as L0 from '../L0_system';
import ISocketServerOptions from './isocketserveroptions';

// create logger
const logger = new L0.Logger("L1:SocketServer_SIO");

export default class SocketServer_SIO extends SocketServer {

    constructor(options: ISocketServerOptions) {

        super();

        this.ss = io(options.httpServer, {
            pingTimeout: 1000,
            pingInterval: 1500,
        });

        this.ss.on('connection', (rawSocket: SocketIO.Socket) => {
            this.connected(new ServerSocket_SIO(rawSocket));
        });
    }

    public shutdown() {
        console.log("CLOSING");
        this.ss.close();
    }

    private ss: SocketIO.Server;
}

//------------------------------------------------------------------------------
// end of file
//------------------------------------------------------------------------------
