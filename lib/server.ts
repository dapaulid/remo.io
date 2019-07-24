import * as L2 from './L2_application';
import * as L1 from './L1_transport';

export default class RemoServer {
    constructor(options: L1.ISocketServerOptions) {
        this.server = new L2.ServerEndpoint(options);
        this.server.registerFunction("Hansli", function hansli(foo: any, bar: number) {
            console.log("HANSLI CALLED ON SERVER WITH foo=" + JSON.stringify(foo) + ", bar=" + bar);
            return 666;
        });
    }

    private server: L2.ServerEndpoint;
}
