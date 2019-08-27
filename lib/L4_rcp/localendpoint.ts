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
import RemoteEndpoint from './remoteendpoint';
import StubCreator from './stubcreator';

import * as L1 from '../L1_transport';
import * as L0 from '../L0_system';
import * as errors from '../errors';

// create logger
const logger = new L0.Logger("L4:LocalEndpoint");

export default class LocalEndpoint extends Endpoint {

    constructor() {
        super();
        this.remotes = new Set();
        this.funcToId = new WeakMap();
        this.nextAnonymousNum = 0;
    }

    public registerFunction(id: string, func: Function) {
        super.registerFunction(id, func);
        // remember function
        // TODO move to base
        // TODO unregister?
        this.funcToId.set(func, id);
        // update remotes
        const desc = StubCreator.createDescriptor(id, func);
        this.remotes.forEach((remote) => {
            remote.funcRegistered(desc);
        });
    }

    public registerFunctions(baseid: string, obj: any) {
        // iterate over properties
        for (const name of Object.keys(obj)) {
            const prop = obj[name];

            // skip nulls
            if (!prop) {
                continue;
            }
            // build full id
            const id = baseid ? baseid + '.' + name : name;

            // check property type
            const type = typeof prop;
            if (type === 'function') {
                // register function
                this.registerFunction(id, prop);
            } else if (type === 'object') {
                // recurse
                this.registerFunctions(id, prop);
            } else {
                // ignore
                logger.verbose("Skipping property " + id + " of type '" + type + '"');
            }
        }
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

    public internalizeFunction(func: Function, prefix?: string): string {
        // do we already know this function?
        let id = this.funcToId.get(func);
        if (!id) {
            // no -> create unique id and add it
            id = (prefix || "") + '#' + this.nextAnonymousNum++;
            this.registerFunction(id, func);
        }
        return id;
    }

    public getFunctionId(func: Function) {
        return this.funcToId.get(func);
    }

    public callFunction(id: string, ...args: any): Promise<any> {
        logger.debug("calling function \"" + id + "\" with", args);
        return new Promise((resolve, reject) => {
            const func = this.functions.get(id);
            if (func) {
                resolve(func.apply(this, args));
            } else {
                reject(new errors.RemoError(errors.L4.FUNC_NOT_FOUND, { id }));
            }
        });
    }

    public shutdown() {
        console.log("LocalEndpoint shutting down");
    }

    protected createRemoteEndpoint(socket: L1.ISocket): Promise<RemoteEndpoint> {
        return new Promise((resolve, reject) => {
            const remote = new RemoteEndpoint(this, socket);
            this.remotes.add(remote);
            logger.debug("RemoteEndpoint created");
            // send function descriptors
            this.functions.forEach((func: Function, id: string) => {
                const desc = StubCreator.createDescriptor(id, func);
                remote.funcRegistered(desc);
            });
            // signal setup complete
            remote.once('connected', () => {
                resolve(remote);
            });
            remote.setup();
        });
    }

    protected createFunctionId(func: Function): string {
        // NOTE: do NOT use func.name due to unexpected results (e.g. console.log -> "bound consoleCall") and minification
        return "TODO"; // func.name;
    }

    protected remotes: Set<RemoteEndpoint>;

    protected funcToId: WeakMap<Function, string>;
    protected nextAnonymousNum: number;
}

//------------------------------------------------------------------------------
// end of file
//------------------------------------------------------------------------------
