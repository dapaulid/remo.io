import IEndpoint from './iendpoint';

import * as L0 from '../L0_system';
import * as errors from '../errors';
import { RemoteEndpoint } from '.';

// create logger
const logger = new L0.Logger("L2:Endpoint");

export default abstract class Endpoint implements IEndpoint {

    constructor() {
        this.functions = new Map();
    }

    public abstract callFunction(id: string, ...args: any): Promise<any>;

    public registerFunction(id: string, func: Function) {
        logger.info("registering function: " + id);
        this.functions.set(id, func);
    }

    public unregisterFunction(id: string): boolean {
        logger.info("unregistering function: " + id);
        return this.functions.delete(id);
    }

    protected functions: Map<string, Function>;
}
