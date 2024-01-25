const express = require("express");
const router = express.Router();
const coupencodeController = require("../controllers/coupencode");
const { verifyToken } = require("../middlewares/authJwt");

// Create a new coupencode
router.post("/", coupencodeController.createCoupencode);

// Get all coupencodes
router.get("/", coupencodeController.getAllCoupencodes);

// Get coupencode by ID
router.get("/:id", coupencodeController.getCoupencodeById);

// Update coupencode
router.put("/:id", coupencodeController.updateCoupencode);

router.put("/addUserToCoupencode/:coupencode", verifyToken,coupencodeController.addUserToCoupencode);

// Delete coupencode
router.delete("/:id", coupencodeController.deleteCoupencode);

module.exports = router;
