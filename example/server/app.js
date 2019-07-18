var express = require('express');
var http = require('http');
var path = require('path');

const RemoServer = require('../../dev/lib/server').default;

/*
    create web server
*/
const app = express();
app.use(express.static(path.join(__dirname,  "../client")));
app.use(express.static(path.join(__dirname,  "../../dev/browser")));

const httpServer = http.createServer(app);

/*
    create rmi server
*/
const rmiServer = new RemoServer({ httpServer });
/*
    serve clients
*/
httpServer.listen(3000, () => {
    console.log("\nexample running at http://localhost:" + httpServer.address().port);
});
