/**
 * @param { import("socket.io").Server } io
 * @param { import("socket.io").Socket } socket
 */
module.exports.bookingHandler = (io, socket) => {
  // join user to their room based on org and branches
  socket.on("user:join:org-branch-room", async (userOrgBranches) => {
    console.log("userOrgBranches", userOrgBranches);

    if (userOrgBranches?.orgLid && userOrgBranches.branches) {
      userOrgBranches.branches.forEach((branch) => {
        socket.join(`${userOrgBranches.orgLid}:${branch.branch_lid}`);
        console.log(
          `user ${userOrgBranches.user.userLid} joined room ${userOrgBranches.orgLid}:${branch.branch_lid}`
        );
      });
    }
  });

  socket.on("server:booking:created", (apps, socketBookingData, ...data) => {
    this.createBooking(io, apps, socketBookingData, ...data);
  });

  socket.on(
    "server:booking:duty-assigned",
    (apps, socketBookingData, ...data) => {
      this.allocateDuty(io, apps, socketBookingData, ...data);
    }
  );

  socket.on(
    "server:booking:trip-dispatched",
    (apps, socketBookingData, ...data) => {
      this.dispatchTrip(io, apps, socketBookingData, ...data);
    }
  );

  socket.on(
    "server:booking:trip-started",
    (apps, socketBookingData, ...data) => {
      this.startTrip(io, apps, socketBookingData, ...data);
    }
  );

  socket.on(
    "server:booking:duty-closed",
    (apps, socketBookingData, ...data) => {
      this.closeDuty(io, apps, socketBookingData, ...data);
    }
  );

  socket.on("server:duty-slip-edited", (apps, socketBookingData, ...data) => {
    this.emitEditDutySlip(io, apps, socketBookingData, ...data);
  });

  socket.on("server:cancelled", (apps, socketBookingData, ...data) => {
    this.cancelBooking(io, apps, socketBookingData, ...data);
  });

  socket.on("server:drafted", (apps, socketBookingData, ...data) => {
    this.createDraft(io, apps, socketBookingData, ...data);
  });

  socket.on("server:draft-deleted", (apps, socketBookingData, ...data) => {
    this.deleteDraft(io, apps, socketBookingData, ...data);
  });
};

module.exports.createBooking = (io, apps, socketBookingData, ...data) => {
  console.log("booking:created", apps, socketBookingData, ...data);
  // Notification to be sent
  if (
    !socketBookingData ||
    !socketBookingData.socket_data ||
    !apps ||
    apps?.length < 1
  )
    return;
  for (let app of apps) {
    for (let room of socketBookingData.socket_data) {
      const branchLid = room.socket_key.split(":")[1];
      console.log("namespace", `/${app}/booking`);
      console.log("room", room.socket_key);
      io.of(`/${app}/booking`)
        .to(room.socket_key)
        .emit("booking:created", room.booking_count, branchLid, ...data);
    }
  }
};

module.exports.allocateDuty = (io, apps, socketBookingData, ...data) => {
  // Notification to be sent
  if (
    !socketBookingData ||
    !socketBookingData.socket_data ||
    !apps ||
    apps?.length < 1
  )
    return;
  for (let app of apps) {
    for (let room of socketBookingData.socket_data) {
      const branchLid = room.socket_key.split(":")[1];
      io.of(`${app}/booking`)
        .to(room.socket_key)
        .emit("booking:duty-assigned", socketBookingData, branchLid, ...data);
    }
  }
};

module.exports.dispatchTrip = (io, apps, socketBookingData, ...data) => {
  // Notification to be sent
  if (
    !socketBookingData ||
    !socketBookingData.socket_data ||
    !apps ||
    apps?.length === 0
  )
    return;
  for (let app of apps) {
    for (let room of socketBookingData.socket_data) {
      const branchLid = room.socket_key.split(":")[1];
      io.of(`${app}/booking`)
        .to(room.socket_key)
        .emit("booking:trip-dispatched", socketBookingData, branchLid, ...data);
    }
  }
};

module.exports.startTrip = (io, apps, socketBookingData, ...data) => {
  // Notification to be sent
  if (
    !socketBookingData ||
    !socketBookingData.socket_data ||
    !apps ||
    apps?.length < 1
  )
    return;
  for (let app of apps) {
    for (let room of socketBookingData.socket_data) {
      const branchLid = room.socket_key.split(":")[1];
      io.of(`${app}/booking`)
        .to(room.socket_key)
        .emit("booking:trip-started", socketBookingData, branchLid, ...data);
    }
  }
};

module.exports.closeDuty = (io, apps, socketBookingData, ...data) => {
  // Notification to be sent
  console.log("socketBookingData", socketBookingData);
  if (
    !socketBookingData ||
    !socketBookingData.socket_data ||
    !apps ||
    apps?.length < 1
  )
    return;

  for (let app of apps) {
    for (let room of socketBookingData.socket_data) {
      const branchLid = room.socket_key.split(":")[1];
      io.of(`${app}/booking`)
        .to(room.socket_key)
        .emit("booking:duty-closed", socketBookingData, branchLid, ...data);
    }
  }
};

module.exports.emitEditDutySlip = (io, apps, socketBookingData, ...data) => {
  console.log("socketBookingData", socketBookingData);
  if (
    !socketBookingData ||
    !socketBookingData.socket_data ||
    !apps ||
    apps?.length < 1
  )
    return;
  for (let app of apps) {
    for (let room of socketBookingData.socket_data) {
      const branchLid = room.socket_key.split(":")[1];
      io.of(`${app}/booking`)
        .to(room.socket_key)
        .emit(
          "booking:duty-slip-edited",
          socketBookingData,
          branchLid,
          ...data
        );
    }
  }
};

module.exports.updateBooking = (io, apps, socketBookingData, ...data) => {
  console.log("socketBookingData", socketBookingData);
  if (
    !socketBookingData ||
    !socketBookingData.socket_data ||
    !apps ||
    apps?.length < 1
  )
    return;
  for (let app of apps) {
    for (let room of socketBookingData.socket_data) {
      const branchLid = room.socket_key.split(":")[1];
      io.of(`${app}/booking`)
        .to(room.socket_key)
        .emit("booking:updated", socketBookingData, branchLid, ...data);
    }
  }
};

module.exports.cancelBooking = (io, apps, socketBookingData, ...data) => {
  if (
    !socketBookingData ||
    !socketBookingData.socket_data ||
    !apps ||
    apps?.length < 1
  )
    return;
  for (let app of apps) {
    for (let room of socketBookingData.socket_data) {
      const branchLid = room.socket_key.split(":")[1];
      io.of(`${app}/booking`)
        .to(room.socket_key)
        .emit("booking:cancelled", socketBookingData, branchLid, ...data);
    }
  }
};

module.exports.createDraft = (io, ...data) => {
  // io.of("/booking").emit('booking:drafted', ...data)
};

module.exports.deleteDraft = (io, ...data) => {
  // io.of("/booking").emit('booking:draft-deleted', ...data)
};
