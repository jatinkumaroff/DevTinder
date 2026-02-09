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

      //self request check
      if (toUserId == fromUserId) {
        throw new Error("bsdk khud ko bhej raha h request?");
      }

      const newRequest = new ConnectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });

      //schema level check
      await newRequest.save();
      res.send("request sent");
    } catch (err) {
      res.status(400).send("connection save nahi hogi kyuki: " + err.message);
    }
  },
);

//review
connectionRouter.post("/connection/review/:status/:requestId",userAuth,async (req, res) => {
  try{

    const { requestId, status } = req.params;
    const loggedInUserId = req.user._id.toString();
    
    //checking if request is present:
    const connectionRequest = await ConnectionRequestModel.findById(requestId);
    if(!connectionRequest){
      throw new Error("aisi koi request hai hi nahi, galat requestId")
    }


    //checking if getting reviewd by correct user:
    if (loggedInUserId != connectionRequest.toUserId.toString()) {
      throw new Error("apni requests dekh, dusro ki kyu dekh raha");
    }

    //STATUS IGNORE TO NAHI HAI:
    if(connectionRequest.status!="interested"){
      throw new Error("nahi ho payega bhai, status interested ke alawa kuch aur hai")
    }

    if (!VALID_REVIEW_STATUS.includes(status)) {
      throw new Error("tere baap ne ye status banaya h?" + status);
    }

    console.log(connectionRequest);
    const updatedRequest= await ConnectionRequestModel.findOneAndUpdate(
      {toUserId:loggedInUserId},
      {$set:{status:status}},
      {new:true}
    )
    console.log(updatedRequest)
    res.send("updated the status for: "+ loggedInUserId +" to " + status);

    
  }catch(err){
    res.status(400).send("connection review me error hai: "+ err.message);
  }
  

  
  },
);
module.exports = connectionRouter;
