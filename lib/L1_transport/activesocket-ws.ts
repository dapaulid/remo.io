import WebSocket from 'ws';

import * as L0 from '../L0_system';

import ActiveSocket from './activesocket';
import { Socket } from 'net';

// create logger
const logger = new L0.Logger("L1:ActiveSocket_WS");

export default class ActiveSocket_WS extends ActiveSocket {

    private url: string | null;
    private ws: WebSocket | null;

    constructor(url?: string | null) {
        super();
        this.url = url === undefined ? this.getWebsocketUrlFromLocation() : url;
        this.ws = null;
    }

    public static fromConnected(ws: WebSocket): ActiveSocket_WS {
        const socket = new ActiveSocket_WS(null);
        socket.setRawSocket(ws);
        socket.connected();
        return socket;
    }

    protected setRawSocket(ws: WebSocket) {
        this.ws = ws;
        this.ws.onopen = () => {
            this.connected();
        };
        this.ws.onclose = (event) => {
            logger.info("onclose fired, reason: " + event.code);
            this.disconnected();
        };
        this.ws.onmessage = (event) => {
            this.receive(event.data);
        };
        this.ws.onerror = () => {
            logger.error("onerror fired");
        };
    }

    protected doConnect(): void {
        if (this.url) {
            this.setRawSocket(new WebSocket(this.url));
        } else {
            logger.error("Cannot connect, URL is null");
            this.ws = null;
        }
    }

    protected doDisconnect(): void {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }

    protected doSend(data: string): void {
        if (this.ws) {
            this.ws.send(data);
        } else {
            logger.error("Cannot send, ws is null");
        }
    }

    protected doReset(): void {
        if (this.ws) {
            // remove all callbacks
            // use dummys to see if there's a zombie knocking...
            this.ws.onopen = function() {
                logger.warn("onopen fired on stale socket");
            };
            this.ws.onclose = function() {
                logger.warn("onclose fired on stale socket");
            };
            this.ws.onmessage = function() {
                logger.warn("onmessage fired on stale socket");
            };
            this.ws.onerror = function() {
                logger.warn("onerror fired on stale socket");
            };
            // finally leave it to the garbage collector
            this.ws = null;
        }
    }

    private getWebsocketUrlFromLocation(): string {
        const loc = window.location;
        return (loc.protocol === 'https:' ? 'wss:' : 'ws:')
            + loc.hostname + ':' + loc.port; // + loc.pathname + loc.search;
    }
}
