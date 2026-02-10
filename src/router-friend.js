const express = require("express");
const userAuth = require("./middleware-userAuth");
const friendRouter = express.Router();
const ConnectionRequestModel = require("./model-connections");
//requests that a user hv received:(pending friend request):
friendRouter.get("/friend/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const friendRequests = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id, //gets all connection requests to the user
      status: "interested",
    })
      .populate("fromUserId", ["firstName", "lastName"])
      .populate("toUserId", "firstName lastName");

    res.json({ data: friendRequests });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//friends -> connection status : accepted
friendRouter.get("/friend/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    //here we will need both, request sent by loggedInUser and received by loggedInUser and then filter them by status:"accepted"
    const friendConnections = await ConnectionRequestModel.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", ["firstName", "lastName"])
      .populate("toUserId", "firstName lastName");

    //read from imortant.txt , what exactly is happening here:
    const data = friendConnections.map((doc) => {
      if (doc.fromUserId._id.equals(loggedInUser._id)) {

        return doc.toUserId;
    }
      return doc.fromUserId;
    });
    res.json({ data });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = friendRouter;
