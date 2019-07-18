import WebSocket from 'isomorphic-ws';

import * as L0 from '../L0_system';
import ClientSocketWS from './activesocket-ws';

import * as http from 'http';
import * as https from 'https';

export interface ISocketServerOptions {
    httpServer: http.Server | https.Server;
}

// create logger
const logger = new L0.Logger("L1:SocketServer_WS");

export class SocketServer_WS {

    constructor(options: ISocketServerOptions) {
        this.wss = new WebSocket.Server({ server: options.httpServer });
        this.wss.on('connection', (ws: WebSocket, req: http.IncomingMessage) => {
            const socket = ClientSocketWS.fromConnected(ws);
            logger.info("Client connected: " + this.sockAddrToStr(
                req.connection.remoteAddress, req.connection.remotePort));
        });
    }

    private sockAddrToStr(host?: string, port?: number) {
        if (host && host.includes(':')) {
            return "[" + host + "]:" + port;
        } else {
            return host + ":" + port;
        }
    }

    private wss: WebSocket.Server;
}
