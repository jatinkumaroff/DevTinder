const express=require('express');
const connectionRouter=express.Router();
const ConnectionRequest =require("./model-connections");
const userAuth=require('./middleware-userAuth')

const VALID_SEND_STATUS=["interested","ignored"]

connectionRouter.post('/connection/send/:status/:toUserId',userAuth, async (req,res)=>{
    try{
        const fromUserId=req.user._id;
        const {toUserId,status}=req.params;

        const newRequest= new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });

        if(!VALID_SEND_STATUS.includes(status)){
            throw new Error('tere baap ne ye status banaya h?' + status);
        }
        console.log(newRequest);
        newRequest.save();
        console.log('request sent by: ' + fromUserId);
        console.log('request sent to: ' + req.params.toUserId);
        console.log('request status is: ' + req.params.status);
        res.send("pohonch gaya idhar ")
    }catch(err){
        res.status(400).send("connection save nahi hogi kyuki: " +err.message)
    }




})

module.exports =connectionRouter;