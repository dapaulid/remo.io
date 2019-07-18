import ISocket from './socket';
import * as L0 from '../L0_system';

// create logger
const logger = new L0.Logger("L1:ActiveSocket");

export default abstract class ActiveSocket implements ISocket {

    constructor() {
        this.idleTimer = new L0.Timer(1000, this.idle);
    }

    public connect(): void {
        logger.verbose("connect");
        this.doConnect();
    }

    public disconnect(): void {
        logger.verbose("disconnect");
        this.doDisconnect();
    }

    protected connected(): void {
        logger.info("connected");
        this.send("Hi from remote!");
        this.idleTimer.start();
    }

    protected disconnected(): void {
        logger.info("disconnected");
    }

    protected idle() {
        logger.info("connection idle!");
    }

    public abstract send(message: any): void;

    protected abstract doConnect(): void;
    protected abstract doDisconnect(): void;

    private idleTimer: L0.Timer;
}
