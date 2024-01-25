const express = require("express");
const router = express.Router();
const {
  createOffer,
  getAllOffers,
  getOfferById,
  updateAddOffer,
  updateOffer,
  deleteOffer,
} = require("../controllers/offerController");

router.post("/", createOffer);

// GET all offers
router.get("/", getAllOffers);

// GET offer by ID
router.get("/:id", getOfferById);

router.put("/updateOffer/:id", updateOffer);

// UPDATE offer
router.put("/:id", updateAddOffer);

// DELETE offer
router.delete("/:id", deleteOffer);

module.exports = router;
