import WebSocket from 'isomorphic-ws';

import ActiveSocket from './activesocket';
import { Socket } from 'net';

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
            console.log("onclose fired, reason: " + event.code);
            this.disconnected();
        };
        this.ws.onmessage = function(msg) {
            console.log("onmessage fired: " + msg.data);
        };
        this.ws.onerror = () => {
            console.log("onerror fired");
        };
    }

    protected doConnect(): void {
        if (this.url) {
            this.setRawSocket(new WebSocket(this.url));
        } else {
            console.log("Cannot connect, URL is null");
            this.ws = null;
        }
    }

    protected doDisconnect(): void {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }

    public send(message: any): void {
        if (this.ws) {
            this.ws.send(message);
        } else {
            console.log("Cannot send, ws is null");
        }
    }

    private getWebsocketUrlFromLocation(): string {
        const loc = window.location;
        return (loc.protocol === 'https:' ? 'wss:' : 'ws:')
            + loc.hostname + ':' + loc.port; // + loc.pathname + loc.search;
    }
}
