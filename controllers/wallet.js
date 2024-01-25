const userSchema = require("../models/user.model");
const PaymentHistory = require("../models/paymentModel");
const User = require("../models/user.model")
exports.addandremoveMoney = async (req, res) => {
  try {
    const userId = req.params.user;
    const { type, balance } = req.body;

    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(400).json({
        message: "User is Not Created ",
      });
    }

    if (type === "add") {
      user.wallet = parseInt(user.wallet) + parseInt(balance);
    } else if (type === "remove") {
      if (parseInt(user.wallet) < parseInt(balance)) {
        return res.status(400).json({ msg: "Insufficient balance" });
      }
      user.wallet = parseInt(user.wallet) - parseInt(balance);
    }

    // Create a payment history record
    const paymentRecord = new PaymentHistory({
      user: userId,
      type: "payment", // 'payment' type for wallet changes
      amount: balance,
      operation: type, // 'add' or 'remove' operation
    });

    // Save the payment history record
    await paymentRecord.save();

    // Update the user's wallet
    const updatedUser = await userSchema.findByIdAndUpdate(
      { _id: userId },
      { wallet: user.wallet },
      { new: true }
    );

    return res.status(200).json({
      status: "success",
      data: updatedUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
};


exports.addandremoveLead = async (req, res) => {
  try {
    const userId = req.params.user;
    const { type, lead } = req.body;

    // Find the user by ID
    const user = await userSchema.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (type === "add") {
      user.lead = (user.lead || 0) + parseInt(lead);
    } else if (type === "remove") {
      if (user.lead < parseInt(lead)) {
        return res.status(400).json({ msg: "Insufficient lead" });
      }
      user.lead = (user.lead || 0) - parseInt(lead);
    }

    // Update the user's lead
    const updatedUser = await userSchema.findByIdAndUpdate(
      userId,
      { lead: user.lead },
      { new: true }
    );

    // Create a lead history record
    const leadHistory = new PaymentHistory({
      user: userId,
      type: "lead", // Indicates it's related to lead
      amount: lead, // The lead amount added or removed
      operation: type, // 'add' or 'remove'
    });

    await leadHistory.save();

    return res.status(200).json({
      status: "success",
      data: updatedUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getWallet = async (req, res) => {
try {
  const userId = req.params.userId;

  // Find the user by their ID
  const user = await userSchema.findById(userId);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Extract the wallet balance from the user object
  const walletBalance = user.wallet || 0; // Default to 0 if wallet is undefined
  const leadBalance = user.lead || 0; 
  return res.status(200).json({
    status: 'success',
    walletBalance,leadBalance
  });
} catch (error) {
  console.error(error);
  return res.status(500).json({ message: 'Internal server error' });
}
};


