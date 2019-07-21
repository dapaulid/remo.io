import * as L1 from './L1_transport';

export default class RemoServer {
    constructor(options: L1.ISocketServerOptions) {
        this.server = new L1.SocketServer_SIO(options);
    }

    private server: L1.ISocketServer;
}
