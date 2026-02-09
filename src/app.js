const express = require("express");
const app = express();
const connectDB = require("./config-database");
const userRouter=require("./router-user");
const connectionRouter=require("./router-connection");
const cookieParser = require("cookie-parser");
app.use(express.json()); 
app.use(express.urlencoded({extended:true})); 
app.use(cookieParser())
app.use('/', userRouter)
app.use('/', connectionRouter)

app.get("/",(req,res)=>{
    res.send("ha sun raha hu , chala");
})


const startServer = async () => {
  try {
    await connectDB();
    app.listen(3000, () => {
      console.log("App Listening on 3000");
    });
  } catch (err) {
    console.log(err.message);
  }
};

startServer();
