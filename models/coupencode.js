const mongoose = require("mongoose");
const objectId = mongoose.Types.ObjectId;
const coupencodeSchema = mongoose.Schema({
  coupencode: {
    type: String,
    default: "",
  },
  user: [
    {
      type: objectId,
      ref: "user",
    },
  ],
  price: {
    type: Number,
    default: 0,
  },
  expireAt: {
    type: String,
    default: "",
  },
  maximumUser:{
    type:Number,
    default:0
  },
  expiration:{
    type:String,
    default:"false"
  }
});
const coupencodeModel = mongoose.model("coupencode", coupencodeSchema);

module.exports = coupencodeModel;
