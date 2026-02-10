const mongoose = require("mongoose");

const connectionSchema = mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["interested", "ignored", "accepted", "rejected"],
        message: "galat status mat daal",
      },
    },
  },
  { timestamps: true },
);

connectionSchema.pre("save", async function () {
  //document that is meant to be saved like User({...}) -this is document
  const doc = this;
  //self request check
  if (doc.toUserId.equals(doc.fromUserId)) {
    throw new Error("bsdk khud ko bhej raha h request?");
  }
});

const ConnectionRequest = mongoose.model("ConnectionRequest", connectionSchema);
module.exports = ConnectionRequest;
