var express = require('express');
var http = require('http');
var path = require('path');

const WebSocket = require('isomorphic-ws');


/*
    create web server
*/
const app = express();
app.use(express.static(path.join(__dirname,  "../client")));
app.use(express.static(path.join(__dirname,  "../../dev/browser")));

const server = http.createServer(app);

/*
    create rmi server
*/
const wss = new WebSocket.Server({ server });
wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });

  ws.send('something');
});

/*
    serve clients
*/
server.listen(3000, () => {
    console.log("\nexample running at http://localhost:" + server.address().port);
});
