//------------------------------------------------------------------------------
/**
 * @license
 * Copyright (c) Daniel Pauli <dapaulid@gmail.com>
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
//------------------------------------------------------------------------------

import ISocket from './socket';
import * as L0 from '../L0_system';
import * as errors from '../errors';
import LinkState from './linkstate';
import RawData from './rawdata';

// create logger
const logger = new L0.Logger("L1:Socket");

export default abstract class Socket implements ISocket {

    public abstract receive(type: string, handler: (message: any) => any): void;
    protected abstract doConnect(): void;
    protected abstract doDisconnect(): void;
    protected abstract doSend(type: string, data: any): Promise<any>;
    protected abstract doReset(): void;

    constructor() {

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

    public send(type: string, message: any): Promise<any> {
        return this.doSend(type, message);
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

    public onstatechanged: ((state: LinkState) => void) | null;

    protected state: LinkState;
    protected stateWatch: L0.Stopwatch;

    // statistics
    protected rxCount: number;
    protected dropCount: number;
}

//------------------------------------------------------------------------------
// end of file
//------------------------------------------------------------------------------
