import LocalEndpoint from './localendpoint';
import RemoteEndpoint from './remoteendpoint';

import * as L1 from '../L1_transport';
import * as L0 from '../L0_system';

// create logger
const logger = new L0.Logger("L2:ClientEndpoint");

export default class ClientEndpoint extends LocalEndpoint {

    constructor() {
        super();
    }

    public connect(url?: string | null): RemoteEndpoint {
        const socket = new L1.ClientSocket_SIO(url || "http://localhost:3000");
        socket.connect();

        return this.createRemoteEndpoint(socket);
    }

}
