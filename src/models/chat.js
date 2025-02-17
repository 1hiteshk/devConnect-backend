const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const chatSchema = new mongoose.Schema({
  participants: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ], // we are making it as ann array so that our chat schema can be between multiple participants we are not restricting to two participants 
  messages: [messageSchema],
  /* if only two players then
  player1: {},
  player2: {},
*/
});

const Chat = mongoose.model("Chat", chatSchema);

module.exports = { Chat };

// separating chat schema and message schema makes it more readable
// for basic number of users in thousands lesser users this database works fine  