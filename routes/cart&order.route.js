const express = require("express");
const router = express.Router();
const auth = require("../controllers/cart&order.controller");
const { validateUser } = require("../middlewares");
// const { authJwt, authorizeRoles } = require("../middlewares");
const { authJwt, authorizeRoles } = require("../middlewares");
router.post("/api/v1/order/checkout", [authJwt.verifyToken], auth.checkout);
router.post(
  "/api/v1/order/placeOrder/:orderId",
  /*verifyToken,*/ auth.placeOrder
);
router.post("/emptyCart/:id", auth.emptyCart);
router.delete('/product/:productId', [authJwt.verifyToken], auth.removeProductFromCart);

router.get("/api/v1/order/allOrders", auth.getAllOrders);
router.get("/api/v1/order/Orders", [authJwt.verifyToken], auth.getOrders);
router.get(
  "/api/v1/service/Orders",
  [authJwt.verifyToken],
  auth.getserviceOrder
);
router.get(
  "/api/v1/product/Orders",
  [authJwt.verifyToken],
  auth.getproductOrder
);
router.get("/api/v1/order/viewOrder/:id", auth.getOrderbyId);
router.put(
  "/api/v1/order/cancelReturnOrder/:id" /*, verifyToken*/,
  auth.cancelReturnOrder
);
router.put(
  "/api/v1/order/updateStatus/:orderId",
  [authJwt.vendorverifyToken],
  auth.updateStatus
);
router.put("/api/v1/order/deliver/:orderId", auth.deliverStatus);
router.put(
  "/api/v1/order/updateStartTime/:id" /*, verifyToken*/,
  auth.updateStartTime
);
router.post("/verifyOtpOfPartner/:id", auth.verifyOtpOfPartner);
router.put(
  "/api/v1/order/updateEndTime/:id" /*, verifyToken*/,
  auth.updateEndTime
);
// app.get("/api/v1/order/getcancelReturnOrder", [authJwt.verifyToken], auth.getcancelReturnOrder);
// app.get("/api/v1/user/allTransactionUser", [authJwt.verifyToken], auth.allTransactionUser);
// app.get("/api/v1/user/allcreditTransactionUser", [authJwt.verifyToken], auth.allcreditTransactionUser);
// app.get("/api/v1/user/allDebitTransactionUser", [authJwt.verifyToken], auth.allDebitTransactionUser);
router.get(
  "/api/v1/order/missed/reject",
  [authJwt.vendorverifyToken],
  auth.missed
);
router.post("/addToCart", [authJwt.verifyToken], auth.addToCart);
router.get("/getCart", [authJwt.verifyToken], auth.getCart);
router.get("/all/new/order", [authJwt.vendorverifyToken], auth.allNewOrders);
router.get("/ongoing/job/:vendorId", auth.ongoingJob);
router.put("/cancel/job/:orderId", auth.cancelJob);
router.put("/reject/job/:orderId", [authJwt.vendorverifyToken], auth.rejectJob);
router.get("/history/job/:vendorId", auth.getJobHistory);
router.put(
  "/increase/qty/:itemId",
  [authJwt.verifyToken],
  auth.increaseServiceQuantity
);
router.put(
  "/decrease/qty/:serviceId",
  [authJwt.verifyToken],
  auth.decrementServiceQuantity
);
router.put("/job/card/:orderId", auth.jobCard);
router.put("/end/job/card/:orderId", auth.endJobCard);
router.put("/end/job/card/newService/:orderId", auth.addNewService);
router.get("/navigate", auth.navigate);
router.post('/:orderId/make-payment', auth.makePayment);
router.put('/:orderId/update/payment-status', auth.updatePaymentStatus);


module.exports = router;
