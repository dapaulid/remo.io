import Endpoint from './endpoint';
import RemoteEndpoint from './remoteendpoint';
import StubCreator from './stubcreator';

import * as L1 from '../L1_transport';
import * as L0 from '../L0_system';
import * as errors from '../errors';

// create logger
const logger = new L0.Logger("L2:LocalEndpoint");

export default class LocalEndpoint extends Endpoint {

    constructor() {
        super();
        this.remotes = new Set();
    }

    public registerFunction(id: string, func: Function) {
        super.registerFunction(id, func);
        // update remotes
        const desc = StubCreator.createDescriptor(id, func);
        this.remotes.forEach((remote) => {
            remote.funcRegistered(desc);
        });
    }

    public unregisterFunction(id: string): boolean {
        if (!super.unregisterFunction(id)) {
            return false;
        }
        this.remotes.forEach((remote) => {
            remote.funcUnregistered(id);
        });
        // success
        return true;
    }

    public callFunction(id: string, ...args: any): Promise<any> {
        logger.debug("calling function \"" + id + "\" with", args);
        return new Promise((resolve, reject) => {
            const func = this.functions.get(id);
            if (func) {
                resolve(func.apply(this, args));
            } else {
                reject(new errors.RemoError(errors.L2.FUNC_NOT_FOUND, { id }));
            }
        });
    }

    protected createRemoteEndpoint(socket: L1.ISocket): RemoteEndpoint {
        const remote = new RemoteEndpoint(this, socket);
        this.remotes.add(remote);
        logger.info("RemoteEndpoint created");
        // send function descriptors
        this.functions.forEach((func: Function, id: string) => {
            const desc = StubCreator.createDescriptor(id, func);
            remote.funcRegistered(desc);
        });
        return remote;
    }

    protected createFunctionId(func: Function): string {
        // NOTE: do NOT use func.name due to unexpected results (e.g. console.log -> "bound consoleCall") and minification
        return "TODO"; // func.name;
    }

    protected remotes: Set<RemoteEndpoint>;
}
