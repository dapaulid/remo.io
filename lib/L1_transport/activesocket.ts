import ISocket from './socket';
import * as L0 from '../L0_system';

export default abstract class ActiveSocket implements ISocket {

    constructor() {
        this.idleTimer = new L0.Timer(1000, this.idle);
    }

    public connect(): void {
        console.log("connect");
        this.doConnect();
    }

    public disconnect(): void {
        console.log("disconnect");
        this.doDisconnect();
    }

    protected connected(): void {
        console.log("connected");
        this.send("Hi from remote!");
        this.idleTimer.start();
    }

    protected disconnected(): void {
        console.log("disconnected");
    }

    protected idle() {
        console.log("connection idle!");
    }

    public abstract send(message: any): void;

    protected abstract doConnect(): void;
    protected abstract doDisconnect(): void;

    private idleTimer: L0.Timer;
}
