const mongoose = require("mongoose");

const connectionSchema = mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
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
  const doc = this;
  //document that is meant to be saved like User({...}) -this is document
  const connectionPresent = await ConnectionRequest.findOne({
    $or: [
      { toUserId: doc.toUserId, fromUserId: doc.fromUserId },
      { toUserId: doc.fromUserId, fromUserId: doc.toUserId },
    ],
  });

  if (connectionPresent) {
    throw new Error("kitni bar bhejega");
  }
});

const ConnectionRequest = mongoose.model("ConnectionRequest", connectionSchema);
module.exports = ConnectionRequest;
