import * as remo from '../../lib';
import http from 'http';

export function run(port: number) {

    const httpServer = http.createServer();

    /*
        configure and create remo server
    */
    // define functions the server should expose to the client
    const api = {
        echo: (param: any) => param,
    };

    const testserver = remo.createServer({ httpServer, api });

    /*
        serve clients
    */
    console.log("before listening...");
    httpServer.listen(3000, () => {
        console.log("\ntestserver running");
    });

    return {
        shutdown: () => {
            testserver.shutdown();
            httpServer.close();
        },
    };
}
