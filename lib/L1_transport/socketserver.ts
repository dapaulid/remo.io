import ISocket from './isocket';
import ISocketServer from './isocketserver';
import * as L0 from '../L0_system';

// create logger
const logger = new L0.Logger("L1:SocketServer");

export default abstract class SocketServer implements ISocketServer {

    constructor() {

        this.onconnected = null;
        this.ondisconnected = null;
    }

    protected connected(socket: ISocket) {
        if (this.onconnected) {
            this.onconnected(socket);
        }
    }

    protected disconnected(socket: ISocket) {
        if (this.ondisconnected) {
            this.ondisconnected(socket);
        }
    }

    public onconnected: ((socket: ISocket) => void) | null;
    public ondisconnected: ((socket: ISocket) => void) | null;

}
