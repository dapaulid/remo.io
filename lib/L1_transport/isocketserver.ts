import ISocket from './isocket';

export default interface ISocketServer {

    // commands

    // callbacks
    onconnected: ((socket: ISocket) => void) | null;
    ondisconnected: ((socket: ISocket) => void) | null;
}
