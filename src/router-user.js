const express = require("express");
const userRouter = express.Router();
const User = require("./model-user");
const validator=require('validator')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken');
const cookieParser=require('cookie-parser')
const userAuth = require('./middleware-userAuth')

userRouter.post("/signup", async (req, res) => {
  const {
    firstName,
    lastName,
    emailId,
    password,
    skills,
    about,
    photoUrl,
    age,
    gender,
  } = req.body;

  //VALIDATIONS
  
  try {
    if(skills.length>5){
      throw new Error(": 5-5 krke skills daal be ")
    }
    if(!validator.isStrongPassword(password) ){
      throw new Error(": password bohot halka hai")
    }

    const passwordHash=await bcrypt.hash(password,10);

    const newUser = await  User.create({
    firstName,
    lastName,
    emailId,
    password:passwordHash,
    skills,
    about,
    photoUrl,
    age,
    gender,
  });
  
  console.log(newUser);
  res.send(newUser);
  }catch(err){
    res.status(400).send("ye dekh error:" + err.message)
  }
});

userRouter.post("/login", async (req, res) => {
  try{
    const { emailId, password } = req.body;
 
    const tryingUser=await User.findOne({emailId});
    console.log(tryingUser);
    if(!tryingUser){
      return res.status(404).send("no user found")
    }
    const isMatch = await bcrypt.compare(password,tryingUser.password)
    
    if(!isMatch){
      return res.status(404).send("password incorrect")
    }
    if(isMatch){
      console.log("matched")
      const loggedInUserId=tryingUser._id;
      console.log(loggedInUserId)
      const token=jwt.sign({_id:loggedInUserId},"null");
      console.log(token)
      res.cookie("token",token);
      return res.send("haan, "+ password + " thik password hai")
    }
    
    
     

  }catch(err){
    res.send(err.message)
  }
});

userRouter.post("/logout",(req,res)=>{
  res.cookie("token","",{
    expires:new Date(Date.now()+7000)
  })
  res.send("wapas aana!")
})

userRouter.post("/konhai",userAuth,(req,res)=>{
  res.send(req.user)
})

module.exports = userRouter;
