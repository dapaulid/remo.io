import WebSocket from 'isomorphic-ws';

export default class ClientSocketWs {

    private url: string;
    private ws: WebSocket;

    constructor(url?: string) {

        this.url = url || this.getWebsocketUrlFromLocation() ;
        this.ws = new WebSocket(this.url);

        this.ws.onopen = function() {
            console.log("WebSocket opened");
        };
        this.ws.onmessage = function(msg) {
            console.log("Data received: " + msg.data);
        };
    }

    private getWebsocketUrlFromLocation(): string {
        const loc = window.location;
        return (loc.protocol === 'https:' ? 'wss:' : 'ws:')
            + loc.hostname + ':' + loc.port; // + loc.pathname + loc.search;
    }
}
