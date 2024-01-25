const mongoose = require("mongoose");
const objectId = mongoose.Types.ObjectId;
var helperSchema = mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", // Reference to the User model
      required: true,
    },
    name: {
      type: String,
    },
    mobileNumber: {
      type: String,
    },
    aadharNumber: {
      type: String,
    },
    frontSide: {
      type: String,
    },
    backSide: {
      type: String,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("helper", helperSchema);
