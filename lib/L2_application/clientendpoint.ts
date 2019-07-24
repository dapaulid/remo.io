import LocalEndpoint from './localendpoint';
import RemoteEndpoint from './remoteendpoint';

import * as L1 from '../L1_transport';
import * as L0 from '../L0_system';

// create logger
const logger = new L0.Logger("L2:ClientEndpoint");

export default class ClientEndpoint extends LocalEndpoint {

    constructor(url?: string | null) {
        super();
        const socket = new L1.ClientSocket_SIO(url || "http://localhost:3000");
        socket.connect();

        this.remote = this.createRemoteEndpoint(socket);
    }

    public getRemote(): RemoteEndpoint {
        return this.remote;
    }

    protected remote: RemoteEndpoint;
}
