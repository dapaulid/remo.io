// import ActiveSocket_WS from './L1_transport/activesocket-ws';
import * as L1 from './L1_transport';

console.log("Powered by remo.js");

export function connect(url?: string | null): L1.ISocket {
    const socket: L1.ISocket = new L1.ClientSocket_SIO(url || "http://localhost:3000"); // ActiveSocket_WS =  new ActiveSocket_WS(url);
    socket.connect();
    return socket;
}
