const httpServer = require("http").createServer();
const SocketIo = require("socket.io");
const { socketHandler } = require("./app/handler");
require("dotenv").config();

console.log("ALLOWED_ORIGINS - ", JSON.parse(process.env.ALLOWED_ORIGINS));

const io = SocketIo(httpServer, {
    cors: {
        origin: JSON.parse(process.env.ALLOWED_ORIGINS),
    },
});

socketHandler(io);

httpServer.listen(3009, () => {
    console.log("Socket Server running on port 3009");
});