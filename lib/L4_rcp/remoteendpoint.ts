//------------------------------------------------------------------------------
/**
 * @license
 * Copyright (c) Daniel Pauli <dapaulid@gmail.com>
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
//------------------------------------------------------------------------------

import Endpoint from './endpoint';
import LocalEndpoint from './localendpoint';

import * as types from './types';

import * as L3 from '../L3_presentation';
import * as L1 from '../L1_transport';
import * as L0 from '../L0_system';
import * as errors from '../errors';
import StubCreator from './stubcreator';

// create logger
const logger = new L0.Logger("L4:RemoteEndpoint");

// messages used for communication
enum Message {
    SETUP = "setup",
    CALL = "call",
    FUNC_REGISTERED = "func-reg",
    FUNC_UNREGISTERED = "func-unreg",
}

export default class RemoteEndpoint extends Endpoint {

    constructor(local: LocalEndpoint, socket: L1.ISocket) {

        super();

        this.local = local;
        this.socket = socket;
        this.linkstate = L1.LinkState.DISCONNECTED;

        this.serializer = new L3.Serializer();

        // add function serializer
        this.serializer.addHandler("Function", {
            serialize: (func: Function) => {
                return this.local.internalizeFunction(func, "auto");
            }, deserialize: (id: string) => {
                const func = this.functions.get(id);
                if (!func) {
                    throw new errors.RemoError(errors.L4.DESER_UNKNOWN_FUNC, { func: id });
                }
                return func;
            },
        });

        this.setLinkState(this.socket.getState());
        this.socket.onstatechanged = this.socketStateChanged.bind(this);

        this.socket.receive(Message.SETUP, () => {
            // setup done, we're ready
            logger.debug("setup complete");
            this.setLinkState(L1.LinkState.CONNECTED);
            return Promise.resolve();
        });

        this.socket.receive(Message.CALL, (serialized) => {
            const msg = this.serializer.deserialize(serialized);
            return this.local.callFunction(msg.id, ...msg.args);
        });
        this.socket.receive(Message.FUNC_REGISTERED, (desc: types.IFuncDesc) => {
            const stub = StubCreator.createStub(desc, this.callFunction.bind(this));
            this.registerFunction(desc.id, stub);
            return Promise.resolve();
        });
        this.socket.receive(Message.FUNC_UNREGISTERED, (msg) => {
            this.unregisterFunction(msg.id);
            return Promise.resolve();
        });
    }

    public shutdown() {
        this.socket.disconnect();
    }

    public callFunction(id: string, ...args: any): Promise<any> {
        logger.debug("calling function \"" + id + "\" with", args);
        const msg = { id, args };
        const serialized = this.serializer.serialize(msg);
        return this.socket.send(Message.CALL, serialized).then((reply: any) => {
            logger.debug("function \"" + id + "\" returned", reply);
            if (reply.error) {
                // failed
                return Promise.reject(errors.revive(reply.error));
            }
            // success
            return reply.result;
        });
    }

    public funcRegistered(desc: types.IFuncDesc) {
        this.socket.send(Message.FUNC_REGISTERED, desc).then((reply: any) => {
            if (reply && reply.error) {
                // failed
                return Promise.reject(errors.revive(reply.error));
            }
            // success
            return Promise.resolve();
        });
    }

    public funcUnregistered(id: string) {
        this.socket.send(Message.FUNC_UNREGISTERED, {id}).then((reply: any) => {
            if (reply && reply.error) {
                // failed
                return Promise.reject(errors.revive(reply.error));
            }
            // success
            return Promise.resolve();
        });
    }

    public setup() {
        this.socket.send(Message.SETUP, null);
    }

    protected socketStateChanged(state: L1.LinkState, reason: errors.RemoError) {
        // socket changed from connecting to connected?
        if (this.linkstate === L1.LinkState.CONNECTING && state === L1.LinkState.CONNECTED) {
            // yes -> we need to wait for SETUP message
            return;
        }
        // change state according to socket state
        this.setLinkState(state, reason);
    }

    protected setLinkState(state: L1.LinkState, reason?: errors.RemoError) {
        // any actual change?
        if (state === this.linkstate) {
            // no -> nothing to do?
            return;
        }
        // update state
        this.linkstate = state;
        // notify observers
        this.emit('linkstatechanged', state, reason);
        switch (state) {
            case L1.LinkState.CONNECTED:
                this.emit('connected');
                break;
            case L1.LinkState.DISCONNECTED:
                this.emit('disconnected');
                break;
            case L1.LinkState.LINKDOWN:
                this.emit('linkdown');
                break;
            default:
                // do nothing
        }
    }

    public getApi() {
        return this.api;
    }

    protected local: LocalEndpoint;
    protected socket: L1.ISocket;
    protected linkstate: L1.LinkState;

    protected serializer: L3.Serializer;
}

//------------------------------------------------------------------------------
// end of file
//------------------------------------------------------------------------------
