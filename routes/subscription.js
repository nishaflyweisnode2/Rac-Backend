const express = require("express");
const router = express.Router();
const subscriptionController = require("../controllers/subscription");


router.post("/", subscriptionController.postSubscriptions);


router.put("/subscribe", subscriptionController.subscribe);

// GET /subscriptions
router.get("/", subscriptionController.getAllSubscriptions);

// GET /subscriptions/:id
router.get("/:id", subscriptionController.getSubscriptionById);

// PUT /subscriptions/:id
router.put("/:id", subscriptionController.updateSubscription);

// DELETE /subscriptions/:id
router.delete("/:id", subscriptionController.deleteSubscription)

module.exports = router



