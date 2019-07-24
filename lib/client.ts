import * as L2 from './L2_application';

console.log("Powered by remo.js");

const client = new L2.ClientEndpoint();
export let server = connect();

export function connect(url?: string | null): L2.RemoteEndpoint {
    const remote = client.connect(url);
    remote.callFunction("Hansli", { gugus: 1234 }, 777).then((result) => {
        console.log("Function on server completed: " + JSON.stringify(result));
    }).catch((err) => {
        console.log("Function on server failed: " + err);
    });
    return remote;
}
