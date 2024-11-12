const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{VALUE} is not a valid status type`,
      },
    },
  },
  { timestamps: true }
);

connectionRequestSchema.index({fromUserId: 1, toUserId: 1,})

connectionRequestSchema.pre('save', function(next){
    const connectionRequest = this;
    // check if the fromUserId is same as toUserId
    if(connectionRequest.fromUserId.toString() === connectionRequest.toUserId.toString()){
      //  return next(new Error('You cannot send connection request to yourself'))
      throw new Error('You cannot send connection request to yourself')
    }
    next();
})

//module.exports = mongoose.model("ConnectionRequestModel", connectionRequestSchema);

const ConnectionRequestModel = new mongoose.model("ConnectionRequest",connectionRequestSchema);
module.exports = ConnectionRequestModel;