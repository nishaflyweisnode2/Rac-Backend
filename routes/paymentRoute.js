const express = require("express");
const walletRouter = express.Router();
const { authJwt, authorizeRoles } = require("../middlewares");

const paymentContrallers = require("../controllers/paymentController");
walletRouter.get(
    "/me",[authJwt.vendorverifyToken],
    paymentContrallers.getWalletTransactionHistory
  );
  walletRouter.get(
    "/me/lead",[authJwt.vendorverifyToken],
    paymentContrallers.getLeadHistory
  );
  
  module.exports = walletRouter;