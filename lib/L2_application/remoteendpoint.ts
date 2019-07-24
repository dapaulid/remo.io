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

import * as L1 from '../L1_transport';
import * as L0 from '../L0_system';
import * as errors from '../errors';
import StubCreator from './stubcreator';

// create logger
const logger = new L0.Logger("L2:RemoteEndpoint");

// messages used for communication
enum Message {
    CALL = "call",
    FUNC_REGISTERED = "func-reg",
    FUNC_UNREGISTERED = "func-unreg",
}

export default class RemoteEndpoint extends Endpoint {

    constructor(local: LocalEndpoint, socket: L1.ISocket) {

        super();

        this.local = local;
        this.socket = socket;

        this.socket.receive(Message.CALL, (msg) => {
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

    public callFunction(id: string, ...args: any): Promise<any> {
        logger.debug("calling function \"" + id + "\" with", args);
        return this.socket.send(Message.CALL, { id, args }).then((reply: any) => {
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

    protected local: LocalEndpoint;
    protected socket: L1.ISocket;
}

//------------------------------------------------------------------------------
// end of file
//------------------------------------------------------------------------------
