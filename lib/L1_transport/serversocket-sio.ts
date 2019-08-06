//------------------------------------------------------------------------------
/**
 * @license
 * Copyright (c) Daniel Pauli <dapaulid@gmail.com>
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
//------------------------------------------------------------------------------

import Socket from './socket';
import * as L0 from '../L0_system';
import * as errors from '../errors';
import RawData from './rawdata';

import io from 'socket.io';

// create logger
const logger = new L0.Logger("L1:ServerSocket_SIO");

export default class ServerSocket_SIO extends Socket {

    constructor(socket: SocketIO.Socket) {

        super();
        this.socket = socket;

        this.socket.on('disconnect', () => {
            this.disconnected();
        });

        if (this.socket.connected) {
            this.connected();
        }
    }

    public receive(type: string, handler: (message: any) => Promise<any>): void {
        if (this.socket) {
            this.socket.on("msg_" + type, (message: any, callback: (reply: any) => void) => {
                try {
                    handler(message).then((result) => {
                        callback({ result });
                    }).catch((error) => {
                        callback({ error: errors.serialize(error) });
                    });
                } catch (error) {
                    logger.error('error handling message "' + type + '":',  error);
                    callback({ error: errors.serialize(error) });
                }
            });
        }
    }

    protected doConnect(): void {
        logger.error("server side socket does not support connecting to client");
    }

    protected doDisconnect(): void {
        if (this.socket) {
            this.socket.disconnect();
        }
    }

    protected doSend(type: string, message: any): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.socket) {
                this.socket.emit('msg_' + type, message, (reply: any) => {
                    resolve(reply);
                });
            } else {
                reject(new errors.RemoError(errors.L1.RAW_SOCKET_NULL));
            }
        });
    }

    protected doReset(): void {
        if (this.socket) {
            this.socket.removeAllListeners();
            this.socket = null;
        }
    }

    protected socket: SocketIO.Socket | null;

}

//------------------------------------------------------------------------------
// end of file
//------------------------------------------------------------------------------
