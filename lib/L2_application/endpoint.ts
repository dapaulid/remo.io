import IEndpoint from './iendpoint';

import * as L0 from '../L0_system';
import * as errors from '../errors';
import { RemoteEndpoint } from '.';

// create logger
const logger = new L0.Logger("L2:Endpoint");

export default abstract class Endpoint implements IEndpoint {

    constructor() {
        this.functions = new Map();
        this.api = {};
    }

    public abstract callFunction(id: string, ...args: any): Promise<any>;

    public registerFunction(id: string, func: Function) {
        logger.info("registering function: " + id);
        this.functions.set(id, func);

        // select api object according to id path
        let api: any = this.api;
        let parent = null;
        let name = null;
        // select parent
        for (const part of id.split('.')) {
            parent = name;
            if (parent) {
                // create new object if not existing
                if (api[parent] == null) {
                    api[parent] = {};
                }
                // move down
                api = api[parent];
            }
            name = part;
        }

        // add to api object
        if (name) {
            api[name] = func;
        }
    }

    public unregisterFunction(id: string): boolean {
        logger.info("unregistering function: " + id);
        return this.functions.delete(id);
    }

    protected functions: Map<string, Function>;
    protected api: any;
}
