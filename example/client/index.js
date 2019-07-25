/*
    This example illustrates how to access a remo.js server from a browser
*/

// call a remote function on our server
remo.server.callFunction("hello", "world").then((result) => {
    console.log("Function on server completed:", result);
}).catch((err) => {
    console.error("Function on server failed:", err);
});
