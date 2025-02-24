const express = require("express");
const requestRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequests");
const User = require("../models/user");
const sendEmail = require("../utils/sendEmail");
const { sendEmailService } = require("../utils/emailService");
// to send connection request
requestRouter.post(
  `/request/send/:status/:toUserId`,
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = [`ignored`, `interested`];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: `Invalid status type: ${status}` });
      }

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({ message: `User not found!` });
      }

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res
          .status(409)
          .json({ message: `Connection request already exists!` });
      }

      const newConnectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await newConnectionRequest.save();
     /*  const emailRes = await sendEmail.run(
        "A new friend request from " + req.user.firstName + req.user.lastName,
        req.user.firstName + " is " + status + " in " + toUser.firstName,
        toUser.emailId
      ); */
      const emailResponse = await sendEmailService( "A new friend request from " + req.user.firstName + " " + req.user.lastName,
        req.user.firstName + " is " + status + " in " + toUser.firstName,
        toUser.emailId);
     // console.log(emailResponse);
      //console.log(toUser,'hmm');

      res.json({
        message: `${req.user.firstName} is ${status} in ${toUser.firstName}`,
        data,
      });
    } catch (error) {
      res.status(400).send(`ERROR: ${error.message}`);
    }
  }
);

// to accept connection request or review it
requestRouter.post(
  `/request/review/:status/:requestId`,
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res
         .status(400)
         .json({ message: `Invalid status type: ${status}` });
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id:requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });
      if (!connectionRequest) {
        return res.status(404).json({ message: `Connection request not found!`});
      }

      connectionRequest.status = status;
      const data = await connectionRequest.save();

      res.json({message: `Connection request ${status}`, data});
    } catch (error) {
        res.status(400).send(`ERROR: ${error.message}`);
    }
  }
);

module.exports = requestRouter;
