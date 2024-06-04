const httpServer = require("http").createServer();
const SocketIo = require("socket.io");
const { socketHandler } = require("./app/handler");
require("dotenv").config();

console.log("ALLOWED_ORIGINS - ", JSON.parse(process.env.ALLOWED_ORIGINS));

const io = SocketIo(httpServer, {
  cors: {
    origin: (origin, callback) => {
      const allowedOrigins = JSON.parse(process.env.ALLOWED_ORIGINS);
      const isOriginAllowed = allowedOrigins.some((allowedOrigin) => {
        const regex = new RegExp(`^${allowedOrigin.replace("*", ".*")}$`);
        return regex.test(origin);
      });
      if (isOriginAllowed || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  },
});

socketHandler(io);

httpServer.listen(process.env.PORT, () => {
  console.log("Socket Server running on port 3009");
});
