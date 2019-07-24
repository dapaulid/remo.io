import * as L2 from './L2_application';
import * as L1 from './L1_transport';

import fs from 'fs';

export default class RemoServer {
    constructor(options: L1.ISocketServerOptions) {
        console.log("Creating RemoServer");
        this.server = new L2.ServerEndpoint(options);
        // some example functions
        this.server.registerFunction("hansli", function hansli(foo: any, bar: number) {
            console.log("HANSLI CALLED ON SERVER WITH foo=" + JSON.stringify(foo) + ", bar=" + bar);
            return 666;
        });
        this.server.registerFunction("log", console.log);
        this.server.registerFunctions("fs", fs);
    }

    private server: L2.ServerEndpoint;
}
