import ISocket from './socket';
import * as L0 from '../L0_system';
import * as errors from '../errors';
import LinkState from './linkstate';
import RawData from './rawdata';

import io from 'socket.io-client';

// create logger
const logger = new L0.Logger("L1:Socket_SIO");

export default class Socket_SIO implements ISocket {

    constructor(url: string) {

        this.socket = null;
        this.onmessage = null;
        this.onstatechanged = null;
        this.state = LinkState.DISCONNECTED;
        this.stateWatch = new L0.Stopwatch();

        this.url = url;

        // init statistics
        this.rxCount = 0;
        this.dropCount = 0;
    }

    public connect(): void {
        // change state
        this.setState(LinkState.CONNECTING);
        this.doConnect();
    }

    public disconnect(): void {
        // change state
        this.setState(LinkState.DISCONNECTING);
        this.doDisconnect();
    }

    public getState(): LinkState {
        return this.state;
    }

    public canConnect(): boolean {
        return true;
    }

    public send(message: any): Promise<void> {
        if (this.socket) {
            this.socket.send(message);
        }
        return Promise.resolve(); // TODO
    }

    protected doConnect(): void {
        this.socket = io(this.url);
        this.socket.on('connect', () => { // engine.io: open
            this.connected();
        });
        this.socket.on('message', (data: RawData) => {
            this.receive(data);
        });
        this.socket.on('disconnect', (reason: string) => { // engine.io: close
            if (reason === 'io server disconnect') {
                // the disconnection was initiated by the server, you need to reconnect manually
                // this.socket.connect();
                this.disconnected();
            } else {
                // the socket will automatically try to reconnect
                this.linkdown();
            }
        });
        this.socket.on('reconnecting', (attempt: number) => {
            this.reconnecting();
        });
        this.socket.on('error', (err: any) => {
            console.log("on error:", err);
        });
        this.socket.on('connect_error', (err: any) => {
            this.linkdown();
        });
    }

    protected doDisconnect(): void {
        if (this.socket) {
            this.socket.close();
        }
    }

    protected doReset(): void {
        if (this.socket) {
            this.socket.removeAllListeners();
            this.socket = null;
        }
    }

    protected receive(data: RawData) {
        // deserialize frame
        // TODO refactor
        // must be string
        if (typeof data !== 'string') {
            throw new errors.RemoError(errors.L1.CODEC_NO_BINARY);
        }
        let message = null;
        try {
            message = JSON.parse(data);
        } catch (err) {
            throw new errors.RemoError(errors.L1.DECODE_FAILED, err);
        }

        // handle state
        switch (this.state) {
            case LinkState.CONNECTED: {
                // we are connected and receiving, reset idle timeout
                // this.idleTimer.restart();
                break;
            }
            case LinkState.LINKDOWN: {
                // we received something, so link must be up again
                this.connected();
                break;
            }
            case LinkState.CONNECTING: {
                // we received something during connecting -> unexpected!
                ++this.dropCount;
                logger.warn("received frame while connecting, dropping it");
                return;
            }
            case LinkState.DISCONNECTING: {
                // we received something during disconnecting -> unexpected!
                ++this.dropCount;
                logger.warn("received frame while disconnecting, dropping it");
                return;
            }
            case LinkState.DISCONNECTED: {
                // we received something while disconnected -> unexpected!
                ++this.dropCount;
                logger.warn("received frame while disconnected, dropping it");
                return;
            }
        }

        // frame successfully received
        ++this.rxCount;

         // pass message to upper layer if any
        if (message !== undefined && this.onmessage) {
            this.onmessage(message);
        }

    }

     protected connected(): void {
        // change state
        this.setState(LinkState.CONNECTED);
        // this.idleTimer.start();
        // reset timers
        // this.connectTimer.stop();
    }

    protected disconnected(): void {
        // change state
        this.setState(LinkState.DISCONNECTED);
        // reset timers
        // this.idleTimer.stop();
        // this.connectTimer.stop();
        // reset raw socket
        this.doReset();
    }

    protected linkdown(): void {
        // change state
        this.setState(LinkState.LINKDOWN);
        // reset timers
        // this.idleTimer.stop();
        // this.connectTimer.stop();
        // reset raw socket
        // this.doReset();
        // try to reconnect
        // if (this.canConnect()) {
        // this.connect();
        // }
    }

    protected reconnecting(): void {
        // change state
        this.setState(LinkState.RECONNECTING);
    }

    protected idle() {
        logger.info("connection idle!");
        // this.ping();
    }

    protected handleCommError(err: errors.RemoError) {
        // something went wrong -> is it a transient error?
        if (err.code === errors.L1.COMM_TIMEOUT.code) {
            // yes -> enter linkdown state and try to reconnect
            this.linkdown();
        } else {
            // no -> give up
            this.disconnected();
        }
    }

    protected setState(state: LinkState) {
        const oldState = this.state;
        this.state = state;
        const elapsed = this.stateWatch.restart();
        // trace info
        logger.debug(oldState + " => " + this.state + " after " + elapsed + " ms");
        // notify upper layer
        if (this.onstatechanged) {
            this.onstatechanged(this.state);
        }
    }

    // protected abstract doConnect(): void;
    // protected abstract doDisconnect(): void;
    // protected abstract doSend(data: RawData): void;
    // protected abstract doReset(): void;

    public onmessage: ((message: any) => void) | null;
    public onstatechanged: ((state: LinkState) => void) | null;

    protected state: LinkState;
    protected stateWatch: L0.Stopwatch;
    protected socket: SocketIOClient.Socket | null;

    protected url: string;

    // statistics
    protected rxCount: number;
    protected dropCount: number;
}
