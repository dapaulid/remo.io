/*
    This example demonstrates how to access a remo.io server from the browser
*/

// call a remote function on our server
remo.getServer().then((server) =>{
    
    server.api.hello("world").then((result) => {
        console.log("Function on server completed:", result);
    }).catch((err) => {
        console.error("Function on server failed:", err);
    });
        
})