const express = require("express");
const connectionRouter = express.Router();
const ConnectionRequestModel = require("./model-connections");
const userAuth = require("./middleware-userAuth");
const VALID_SEND_STATUS = ["interested", "ignored"];
const VALID_REVIEW_STATUS = ["accepted", "rejected"];
const User = require("./model-user");

//send
connectionRouter.post(
  "/connection/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id.toString();
      const { toUserId, status } = req.params;

      //status check
      if (!VALID_SEND_STATUS.includes(status)) {
        throw new Error("tere baap ne ye status banaya h?" + status);
      }

      //user check
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        throw new Error("mann se bana raha hai kya user id?");
      }

      const connectionPresent = await ConnectionRequestModel.findOne({
        $or: [
          { toUserId, fromUserId },
          { toUserId: fromUserId, fromUserId: toUserId },
        ],
      });

      if (connectionPresent) {
        throw new Error("kitni bar bhejega");
      }

      const newRequest = await new ConnectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });

      console.log(newRequest);
      //schema level check
      await newRequest.save();
      res.send("request sent");
    } catch (err) {
      res.status(400).send("connection save nahi hogi kyuki: " + err.message);
    }
  },
);

//review
connectionRouter.post(
  "/connection/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const { requestId, status } = req.params;
      const loggedInUser = req.user;
      const loggedInUserId = loggedInUser._id.toString();

      //Status Validity:
      if (!VALID_REVIEW_STATUS.includes(status)) {
        throw new Error("tere baap ne ye status banaya h?" + status);
      }

      //checking if request is present:   => instead of three seperate checks for 1. ersquest id present in db, 2. checked by the correct user, 3. status should be interested only,  write all in single query by including all in finding matching request:
      const connectionRequest = await ConnectionRequestModel.findOne({
        _id: requestId,
        toUserId: loggedInUser._id, //check the object==object
        status: "interested",
      });

      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: "aisi koi request hai hi nahi, galat requestId" });
      }

      //agar nahi mila , toh upar hi handle ho jayega.. mil gaya to modify karne ke liye:

      const updatedRequest = await ConnectionRequestModel.findOneAndUpdate(
        { _id: requestId },
        { $set: { status: status } },
        { new: true },
      );

      
      res.send("updated the status for: " + loggedInUserId + " to " + status);
    } catch (err) {
      res.status(400).send("connection review me error hai: " + err.message);
    }
  },
);
module.exports = connectionRouter;
