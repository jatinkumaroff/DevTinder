const mongoose = require("mongoose");
const express = require("express");
const app = express();

const connectDB = async () => {
  await mongoose.connect("mongodb://127.0.0.1:27017/DevTinder").then(() => {
    console.log("DB connected: DevTinder");
  });
};

module.exports = connectDB;
