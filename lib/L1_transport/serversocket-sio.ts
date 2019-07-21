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

        this.socket.on('message', (data: RawData) => {
            this.receive(data);
        });
        this.socket.on('disconnect', () => {
            this.disconnected();
        });

        if (this.socket.connected) {
            this.connected();
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

    protected socket: SocketIO.Socket | null;

}
