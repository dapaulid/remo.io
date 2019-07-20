import io from 'socket.io';

import * as L0 from '../L0_system';

import * as http from 'http';
import * as https from 'https';

export interface ISocketServerOptions {
    httpServer: http.Server | https.Server;
}

// create logger
const logger = new L0.Logger("L1:ServerSocket_SIO");

export class ServerSocket_SIO {

    constructor(options: ISocketServerOptions) {
        this.ss = io(options.httpServer, {
            pingTimeout: 1000,
            pingInterval: 1500,
        });
        this.count = 0;
        this.ss.on('connection', (client: SocketIO.Socket) => {
            this.count++;
            const connectTime = new L0.Stopwatch();
            logger.info('connect: ' + client.id + ' (' + this.count + ')');
            client.on('message', (data) => { logger.info('message' + data); });
            client.on('disconnect', () => { this.count--; console.log('disconnect ' + client.id  + ' after ' + connectTime.elapsedMs() + ' ms (' + this.count + ')'); });
        });
    }

    private count: number;

    private ss: SocketIO.Server;
}
