const httpServer = require("http").createServer();
const SocketIo = require("socket.io");
const { socketHandler } = require("./app/handler");
require("dotenv").config();

console.log("ALLOWED_ORIGINS - ", JSON.parse(process.env.ALLOWED_ORIGINS));

const io = SocketIo(httpServer, {
  cors: {
    origin: (origin, callback) => {
      callback(null, true);
    },
  },
});

socketHandler(io);

httpServer.listen(process.env.PORT, () => {
  console.log(`Socket Server running on port ${process.env.PORT}`);
});
