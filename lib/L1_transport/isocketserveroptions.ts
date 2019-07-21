import * as http from 'http';
import * as https from 'https';

export default interface ISocketServerOptions {
    httpServer: http.Server | https.Server;
}
