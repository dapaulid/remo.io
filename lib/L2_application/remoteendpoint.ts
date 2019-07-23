import IEndpoint from './iendpoint';
import LocalEndpoint from './localendpoint';

import * as L1 from '../L1_transport';
import * as L0 from '../L0_system';
import * as errors from '../errors';

// create logger
const logger = new L0.Logger("L2:RemoteEndpoint");

// messages used for communication
enum Message {
    CALL = "call",
}

export default class RemoteEndpoint implements IEndpoint {

    constructor(local: LocalEndpoint, socket: L1.ISocket) {

        this.local = local;
        this.socket = socket;

        this.socket.receive(Message.CALL, (msg) => {
            return this.local.callFunction(msg.id, msg.args);
        });
    }

    public callFunction(id: string, ...args: any): Promise<any> {
        return this.socket.send(Message.CALL, { id, args }).then((reply: any) => {
            if (reply.error) {
                // failed
                const err = reply.error;
                if (err.name === "RemoError") {
                    // revive it
                    return Promise.reject(new errors.RemoError({ label: err.label, code: err.code, text: err.text }, err.details));
                } else {
                    // unknown error
                    // TODO use class RemoteError for this?
                    return Promise.reject(new errors.RemoError(errors.L2.UNKNOWN_RPC_ERROR, err));
                }
            }
            // success
            return reply.result;
        });
    }

    protected local: LocalEndpoint;
    protected socket: L1.ISocket;
}
