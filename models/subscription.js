const mongoose = require("mongoose");

const subscriptionSchema = mongoose.Schema({
  planName: {
    type: String,
    enum: ["Free", "Silver", "Gold", "Platinum"],
    default: "Free",
  },
//   popular: {
//     type: Boolean,
//     default: false,
//   },
  amount: {
    type: Number,
  },
//   color: {
//     type: String,
//   },
  data: [{
    type: String,
  }],
});



module.exports = mongoose.model("Subscription", subscriptionSchema)