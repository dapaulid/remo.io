/*
    This example demonstrates how to setup and run a remo.io server
*/

var express = require('express');
var http = require('http');
var path = require('path');
var fs = require('fs');

const remo = require('../..');

/*
    configure and create web server
*/
const app = express();
// serve application files
app.use(express.static(path.join(__dirname,  "../client")));
// serve remo.io library
app.use(express.static(path.join(__dirname,  "../../dist/browser")));

const httpServer = http.createServer(app);

/*
    configure and create remo server
*/
// define functions the server should expose to the client
const api = {
    hello: function (what) {
        console.log("Hello " + what + " from client!");
        return "Hello from server!";
    },
    somePromise: function(value) {
        return new Promise((resolve, reject) => {
            if (value != null) {
                resolve(value+1)
            } else {
                reject("Specify a value!");
            }
        });
    },
    callMeBack: function(cb1, cb2) {
        cb1("Server called you back");
        cb2("Server called you back again");
    },
    echo: (param) => param,
    // you can also expose builtins...
    log: console.log,
    // ... or even all functions of a module
    fs,
}
const remoServer = remo.createServer({ httpServer, api });

/*
    serve clients
*/
httpServer.listen(3000, () => {
    console.log("\nexample running at http://localhost:" + httpServer.address().port);
});
