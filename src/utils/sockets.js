const socket = require("socket.io");

const initializeSocket = (server) => {
    console.log('Initializing socket connection ...');
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    console.log("a new client connected");
    // handle events
    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      const room = [userId, targetUserId].sort().join("_"); // if room ids are same then they are talking to each other
      // now if they send the messages to this room the message will be sent to each other p1->p2 and p2->p1

      socket.join(room); // we need to create room in that sever with a unique id and then we join room so one connection is established in a particular room
      // basically we re trying to create a connection between 1 userId and 1 targetUserId and we need to create a room for just these two people
      // assume there are thousands of people who are sending connection requests , this code will be called by thousands of people simultaneously
      // how do we know which person wants to chat with whom and how do we connect both of them we connect via roomId
      //
    });

    socket.on("sendMessage", ({ firstName, userId, targetUserId, text }) => {
      console.log(`sendMessage event triggered`);
      // here we will listen the messages sent from the frontend to ws and send the message back to a room
      const roomId = [userId, targetUserId].sort().join("_"); // create this roomId in a more secure way using hash so that no one can hack your chats using your userId and targetUserId, so that no one can guess your roomId
      console.log(firstName + " " + text);
      io.to(roomId).emit("messageReceived", { firstName, text }); // emit means server is sending the message
      // messageReceived event and then we emit a particular message or we can emit any data over here
      // now we have emitted messageReceived event from server and we have to listen it on client side frontend to see it on ui as well
    });
    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
