const { bookingHandler } = require("./booking.socket")
const { apps } = require("./constant")

/**
 * @param { import("socket.io").Server } io
 * @param { import("socket.io").Socket } socket
 */
module.exports.socketHandler = (io, socket) => {
  // create namespace for each module and app

  // booking namespace
  apps.forEach(app => {
    io.of(`/${app}/booking`).on('connection', (_socket) => {
      console.log(`Connected to /${app}/booking namespace`);
      bookingHandler(io, _socket)
    })
  })
}
