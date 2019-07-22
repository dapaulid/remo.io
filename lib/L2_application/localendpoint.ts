import IEndpoint from './iendpoint';

import * as L0 from '../L0_system';
import * as errors from '../errors';

// create logger
const logger = new L0.Logger("L2:LocalEndpoint");

export default class LocalEndpoint implements IEndpoint {

    constructor() {
        this.functions = new Map();
    }

    public registerFunction(id: string, func: Function) {
        this.functions.set(id, func);
    }

    public unregisterFunction(id: string): boolean {
        return this.functions.delete(id);
    }

    public callFunction(id: string, ...args: any): Promise<any> {
        return new Promise((resolve, reject) => {
            logger.info("Calling function " + id + " with " + args);
            const func = this.functions.get(id);
            if (func) {
                resolve(func.apply(this, ...args));
            } else {
                reject(new errors.RemoError(errors.L2.FUNC_NOT_FOUND, { id }));
            }
        });
    }

    protected functions: Map<string, Function>;
}
