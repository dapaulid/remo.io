import ISocket from './socket';
import * as L0 from '../L0_system';
import * as errors from '../errors';
import LinkState from './linkstate';
import RawData from './rawdata';

// create logger
const logger = new L0.Logger("L1:ActiveSocket");

enum CtrlType {
    PING = "ping",
    ACK  = "ack",
}

interface IFrame {
    ctrl?: CtrlType;
    id: number;
    data?: any;
}

interface IPendingFrame {
    resolve: () => void;
    reject: (err: errors.RemoError) => void;
    timeout: L0.Timer;
}

interface IActiveSocketConfig {
    commTimeout: number;
}

export default abstract class ActiveSocket implements ISocket {

    constructor() {
        this.onmessage = null;
        this.onstatechanged = null;
        this.state = LinkState.DISCONNECTED;
        this.nextFrameId = 0;
        this.pendingFrames = new Map();
        this.idleTimer = new L0.Timer(1000, this.idle.bind(this));

        // config
        this.config = {
            commTimeout: 1000,
        };

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

    public send(message: any): Promise<void> {
        return this.sendFrame(undefined, message).catch((err: errors.RemoError) => {
            this.handleCommError(err);
        });
    }

    protected sendFrame(ctrl?: CtrlType, payload?: any, id?: number): Promise<void> {
        return new Promise((resolve, reject) => {

            // create frame
            const frame: IFrame = {
                ctrl,
                id: id != null ? id : this.getNextFrameId(),
                data: payload,
            };

            // serialize frame
            // TODO refactor
            let data = null;
            try {
                data = JSON.stringify(frame);
            } catch (err) {
                throw new errors.RemoError(errors.L1.ENCODE_FAILED, err);
            }

            // remember frame if it has a new id (e.g. not an ACK)
            if (id == null) {
                // frame with this id already pending?
                if (this.pendingFrames.has(frame.id)) {
                    // yes -> we have a problem
                    reject(new errors.RemoError(errors.L1.FRAME_ID_COLLISION));
                    return;
                }
                // create new pending frame
                const pendingFrame: IPendingFrame = {
                    resolve, reject,
                    timeout: new L0.Timer(this.config.commTimeout, () => {
                        // pending frame timed out
                        this.completePendingFrame(frame.id, new errors.RemoError(errors.L1.COMM_TIMEOUT));
                    }),
                };
                // remember it
                this.pendingFrames.set(frame.id, pendingFrame);

                // start communication timeout
                pendingFrame.timeout.start();

            } else {
                // it is an ACK -> complete immediately
                resolve();
            }

            // send serialized frame
            this.doSend(data);
        });
    }

    protected receive(data: RawData) {
        // deserialize frame
        // TODO refactor
        // must be string
        if (typeof data !== 'string') {
            throw new errors.RemoError(errors.L1.CODEC_NO_BINARY);
        }
        let frame = null;
        try {
            frame = JSON.parse(data);
        } catch (err) {
            throw new errors.RemoError(errors.L1.DECODE_FAILED, err);
        }
        // has id?
        if (frame.id == null) {
            // no -> drop it
            ++this.dropCount;
            logger.warn("dropped frame with missing id");
            return;
        }
        // send ACK (if it is not an ACK itself)
        if (frame.ctrl !== CtrlType.ACK) {
            this.sendFrame(CtrlType.ACK, undefined, frame.id).catch((err) => {
                console.error("Unexpected error while sending ACK: " + err);
            });
        }

        let message: any;

        // check frame type
        if (frame.ctrl == null) {
            // contains message -> remember it
            message = frame.data;
        } else if (frame.ctrl === CtrlType.ACK) {
            // acknowledgement
            // TODO implement
            logger.debug("RECEIVED ACK " + frame.id);

            // complete pending frame
            if (!this.completePendingFrame(frame.id)) {
                // unkown id -> drop it
                ++this.dropCount;
                logger.warn("dropped ack with unexpected id: " + frame.id);
                return;
            }

        } else if (frame.ctrl === CtrlType.PING) {
            // ping request -> nothing to do, answered before with ACK
        } else {
            // unkown frame -> drop it
            ++this.dropCount;
            logger.warn("dropped frame with unknown type: " + frame.ctrl);
            return;
        }

        // handle state
        switch (this.state) {
            case LinkState.CONNECTED: {
                // we are connected and receiving, reset idle timeout
                this.idleTimer.restart();
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

    protected completePendingFrame(id: number, err?: errors.RemoError): boolean {

        // get pending frame
        const pendingFrame = this.pendingFrames.get(id);
        if (!pendingFrame) {
            // unkown id
            return false;
        }

        // remove it from list
        this.pendingFrames.delete(id);

        // stop timeout
        pendingFrame.timeout.stop();

        // complete corresponding send call
        if (!err) {
            pendingFrame.resolve();
        } else {
            pendingFrame.reject(err);
        }

        // success
        return true;
    }

    protected ping() {
        this.sendFrame(CtrlType.PING).catch((err: errors.RemoError) => {
            this.handleCommError(err);
        });
    }

    protected connected(): void {
        // change state
        this.setState(LinkState.CONNECTED);
        this.idleTimer.start();
    }

    protected disconnected(): void {
        // change state
        this.setState(LinkState.DISCONNECTED);
        // reset timers
        this.idleTimer.stop();
        // reset raw socket
        this.doReset();
    }

    protected linkdown(): void {
        // change state
        this.setState(LinkState.LINKDOWN);
        // reset timers
        this.idleTimer.stop();
    }

    protected idle() {
        logger.info("connection idle!");
        this.ping();
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
        // trace info
        logger.verbose(oldState + " => " + this.state);
        // notify upper layer
        if (this.onstatechanged) {
            this.onstatechanged(this.state);
        }
    }

    protected getNextFrameId(): number {
        return this.nextFrameId++;
    }

    protected abstract doConnect(): void;
    protected abstract doDisconnect(): void;
    protected abstract doSend(data: RawData): void;
    protected abstract doReset(): void;

    public onmessage: ((message: any) => void) | null;
    public onstatechanged: ((state: LinkState) => void) | null;

    public config: IActiveSocketConfig;

    protected state: LinkState;
    protected nextFrameId: number;
    protected idleTimer: L0.Timer;
    protected pendingFrames: Map<number, IPendingFrame>;

    // statistics
    protected rxCount: number;
    protected dropCount: number;
}
