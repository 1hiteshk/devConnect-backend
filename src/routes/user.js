const express = require("express");
const userRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequests");

const USER_SAFE_DATA = " firstName lastName photoUrl age gender skills about ";

// get all the pending connection requests for the logged in user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const receivedRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

    res.json({
        message: "Data fetched successfully",
        data: receivedRequests,
  
    });
  } catch (error) {
    res.status(400).send(`Error : ${error.message}`);
  }
});

userRouter.get('/user/connections', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connections = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id, status: 'accepted' },
                { toUserId: loggedInUser._id , status: 'accepted' },
            ],
            // status: "accepted",
        }).populate('fromUserId toUserId', USER_SAFE_DATA);

        console.log(connections.toJSON());

        const data = connections.map((row)=>{
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId;
        })

        res.json({data})
    } catch (error) {
        res.status(400).send({message: error.message});
    }
})
