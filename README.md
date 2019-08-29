[![NPM version](https://badge.fury.io/js/remo.io.svg)](https://www.npmjs.com/package/remo.io)
[![build](https://travis-ci.org/dapaulid/remo.io.svg?branch=master)](https://travis-ci.org/dapaulid/remo.io)
[![codecov](https://codecov.io/gh/dapaulid/remo.io/branch/master/graph/badge.svg)](https://codecov.io/gh/dapaulid/remo.io)

# Remo.IO
An intuitive, robust and efficient RPC library for Node.js and the browser.

## Purpose

This library allows to expose any functions on your Node.js server so that they can be called from the browser just as if they were normal, local JavaScript functions. Callback functions will be passed as reference, allowing the server in turn to call functions directly on the client.

Remo.IO aims to handle serialization of arbitrary objects (passed by value), take care of session and reconnection handling as well as properly propagate errors between server and client. It uses [Socket.IO](https://www.npmjs.com/package/socket.io) for transport.

## Installation
```
npm install remo.io
```

## Usage

### Server

```js
const remo = require('remo.io');

// define functions the server should expose to the client
const api = {
    hello: function (what) {
        console.log("Hello " + what + " from client!");
        return "Hello from server!";
    },
    // you can also expose builtins...
    log: console.log,
    // ... or even all functions of a module
    fs
}
const remoServer = remo.createServer({ httpServer, api });
```

### Client

```js
// call a remote function on our server
remo.getServer().then((server) =>{
    
    server.api.hello("world").then((result) => {
        console.log("Function on server completed:", result);
    }).catch((err) => {
        console.error("Function on server failed:", err);
    });
        
})
```

For a full example, do the following:

```bash
git clone https://github.com/dapaulid/remo.io
cd remo.io
npm install
npm run example
```

## Debugging

Remo.io uses [debug](https://www.npmjs.com/package/debug) to output traces, which allows to selectively enable debug output.

For the server, set the DEBUG environment variable before starting your app:
```bash
DEBUG=remo.io:* node myapp
```

In the browser, set the following variable using the developer console and reload your app:
```js
localStorage.debug = "remo.io:*"
```
