const express = require("express");
const app = express();
const connectDB = require("./config-database");
const userRouter = require("./router-user");
const connectionRouter = require("./router-connection");
const friendRouter = require("./router-friend");
const profileRouter = require("./router-profile");
const cookieParser = require("cookie-parser");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/", userRouter);
app.use("/", connectionRouter);
app.use("/", friendRouter);
app.use("/", profileRouter);



app.get("/", (req, res) => {
  res.send("ha sun raha hu , chala");
});

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
