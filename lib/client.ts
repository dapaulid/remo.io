import ActiveSocket_WS from './L1_transport/activesocket-ws';

console.log("Powered by remo.js");

export function connect(url?: string | null): ActiveSocket_WS {
    const socket: ActiveSocket_WS =  new ActiveSocket_WS(url);
    socket.connect();
    return socket;
}
