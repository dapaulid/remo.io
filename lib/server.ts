//------------------------------------------------------------------------------
/**
 * @license
 * Copyright (c) Daniel Pauli <dapaulid@gmail.com>
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
//------------------------------------------------------------------------------

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
        this.server.registerFunction("echo", (param: any) => param);
        this.server.registerFunction("log", console.log);
        this.server.registerFunctions("fs", fs);
    }

    private server: L2.ServerEndpoint;
}

//------------------------------------------------------------------------------
// end of file
//------------------------------------------------------------------------------
