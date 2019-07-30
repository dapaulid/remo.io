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

import io from 'socket.io-client';

// create logger
const logger = new L0.Logger("L1:CLientSocket_SIO");

export default class CLientSocket_SIO extends Socket {

    constructor(url?: string) {

        super();
        this.socket = null;
        this.url = url || ""; // use window.location

        this.receivers = new Map();
    }

    public receive(type: string, handler: (message: any) => any): void {
        this.receivers.set(type, handler);
        // TODO de-duplicate code #1
        if (this.socket) {
            this.socket.on("msg_" + type, (message: any, callback: (reply: any) => void) => {
                handler(message).then((result: any) => {
                    callback({ result });
                }).catch((error: any) => {
                    callback({ error });
                });
            });
        }
    }

    protected doConnect(): void {
        this.socket = io(this.url);
        this.socket.on('connect', () => { // engine.io: open
            this.connected();
        });
        // register message specific handlers
        this.receivers.forEach((handler: (message: any) => Promise<any>, type: string) => {
            // TODO de-duplicate code #1
            if (this.socket) {
                this.socket.on("msg_" + type, (message: any, callback: (reply: any) => void) => {
                    handler(message).then((result) => {
                        callback({ result });
                    }).catch((error) => {
                        callback({ error: errors.serialize(error) });
                    });
                });
            }
        });
        this.socket.on('disconnect', (reason: string) => { // engine.io: close
            if (reason === 'io server disconnect') {
                // the disconnection was initiated by the server, you need to reconnect manually
                // this.socket.connect();
                this.disconnected();
            } else {
                // the socket will automatically try to reconnect
                this.linkdown();
            }
        });
        this.socket.on('reconnecting', (attempt: number) => {
            this.reconnecting();
        });
        this.socket.on('error', (err: any) => {
            console.log("on error:", err);
        });
        this.socket.on('connect_error', (err: any) => {
            this.linkdown();
        });
    }

    protected doDisconnect(): void {
        if (this.socket) {
            this.socket.close();
        }
    }

    protected doSend(type: string, message: any): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.socket) {
                this.socket.emit('msg_' + type, message, (reply: any) => {
                    resolve(reply);
                });
            }
        });
    }

    protected doReset(): void {
        if (this.socket) {
            this.socket.removeAllListeners();
            this.socket = null;
        }
    }

    protected socket: SocketIOClient.Socket | null;
    protected url: string;

    protected receivers: Map<string, (message: any) => Promise<any>>;
}

//------------------------------------------------------------------------------
// end of file
//------------------------------------------------------------------------------
