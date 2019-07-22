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
        this.remotes = new Set();
    }

    protected connected(socket: L1.ISocket): void {
        this.remotes.add(new RemoteEndpoint(this, socket));
        logger.info("RemoteEndpoint connected");
    }

    protected server: L1.ISocketServer;
    protected remotes: Set<RemoteEndpoint>;

}
