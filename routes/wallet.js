const express = require("express");
const walletRouter = express.Router();
const { authJwt, authorizeRoles } = require("../middlewares");

const walletContrallers = require("../controllers/wallet");

walletRouter.post(
  "/addandremoveMoney/:user",
  walletContrallers.addandremoveMoney
);
walletRouter.post(
  "/addandremoveLead/:user",
  walletContrallers.addandremoveLead
);
walletRouter.get(
  "/get/wallet/:userId",
  walletContrallers.getWallet
);


module.exports = walletRouter;
