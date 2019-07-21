import ISocket from './socket';
import * as L0 from '../L0_system';
import * as errors from '../errors';
import LinkState from './linkstate';
import RawData from './rawdata';

// create logger
const logger = new L0.Logger("L1:Socket");

export default abstract class Socket implements ISocket {

    protected abstract doConnect(): void;
    protected abstract doDisconnect(): void;
    protected abstract doSend(data: RawData): void;
    protected abstract doReset(): void;

    constructor() {

        this.onmessage = null;
        this.onstatechanged = null;
        this.state = LinkState.DISCONNECTED;
        this.stateWatch = new L0.Stopwatch();

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

    public send(message: any): void {
        // serialize frame
        // TODO refactor
        let data = null;
        try {
            data = JSON.stringify(message);
        } catch (err) {
            throw new errors.RemoError(errors.L1.ENCODE_FAILED, err);
        }
        this.doSend(data);
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
    }

    protected disconnected(): void {
        // change state
        this.setState(LinkState.DISCONNECTED);
        // reset raw socket
        this.doReset();
    }

    protected linkdown(): void {
        // change state
        this.setState(LinkState.LINKDOWN);
    }

    protected reconnecting(): void {
        // change state
        this.setState(LinkState.RECONNECTING);
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

    public onmessage: ((message: any) => void) | null;
    public onstatechanged: ((state: LinkState) => void) | null;

    protected state: LinkState;
    protected stateWatch: L0.Stopwatch;

    // statistics
    protected rxCount: number;
    protected dropCount: number;
}
