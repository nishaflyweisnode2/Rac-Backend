const userSchema = require("../models/user.model");
const PaymentHistory = require("../models/paymentModel");

exports.getWalletTransactionHistory = async (req, res) => {
    console.log("hi");
    try {
      const userId = req.user.id; // Get the user's ID from the authenticated user
  
      // Find all wallet transaction history records for the user
      const transactions = await PaymentHistory.find({
        user: userId,
        type: 'payment', // Filter by payment type (wallet transactions)
      }).sort({ created_at: -1 }); // Sort by the most recent transactions first
  
      return res.status(200).json({
        status: 'success',
        data: transactions,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        error: error.message,
      });
    }
  };

 

exports.getLeadHistory = async (req, res) => {
    console.log("hi");
  try {
    const userId = req.user.id; // Get the user's ID from the authenticated user

    // Find all lead history records for the user
    const leadHistory = await PaymentHistory.find({
      user: userId,
      type: 'lead', // Filter by lead type
    }).sort({ created_at: -1 }); // Sort by the most recent lead history first

    return res.status(200).json({
      status: 'success',
      data: leadHistory,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message,
    });
  }
};
