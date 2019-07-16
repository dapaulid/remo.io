import ClientSocketWs from './clientsocket-ws';

console.log("Powered by remo.js");

export function connect(): ClientSocketWs {
    return new ClientSocketWs();
}
