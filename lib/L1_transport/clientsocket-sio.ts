import Socket from './socket';
import * as L0 from '../L0_system';
import * as errors from '../errors';
import RawData from './rawdata';

import io from 'socket.io-client';

// create logger
const logger = new L0.Logger("L1:CLientSocket_SIO");

export default class CLientSocket_SIO extends Socket {

    constructor(url: string) {

        super();
        this.socket = null;
        this.url = url;
    }

    protected doConnect(): void {
        this.socket = io(this.url);
        this.socket.on('connect', () => { // engine.io: open
            this.connected();
        });
        this.socket.on('message', (data: RawData) => {
            this.receive(data);
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

    protected doSend(data: RawData): void {
        if (this.socket) {
            this.socket.send(data);
        }
    }

    protected doReset(): void {
        if (this.socket) {
            this.socket.removeAllListeners();
            this.socket = null;
        }
    }

    protected socket: SocketIOClient.Socket | null;
    protected url: string;

}
