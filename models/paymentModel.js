const mongoose = require("mongoose");

const paymentHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  type: {
    type: String, // 'payment' or 'lead', for example
    required: true,
  },
  amount: {
    type: Number, // The amount added or removed
    required: true,
  },
  operation: {
    type: String, // 'add' or 'remove' to indicate whether the amount is added or removed
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("PaymentHistory", paymentHistorySchema);
