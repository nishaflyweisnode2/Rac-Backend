const express = require("express");
const router = express.Router();
const subsubcategoryController = require("../controllers/subsubcategory");

// Create a new subsubcategory
router.post("/", subsubcategoryController.createSubsubcategory);

router.get("/", subsubcategoryController.getSubsubcategory);

// Get a subsubcategory by ID
router.get("/:id", subsubcategoryController.getSubsubcategoryById);

// Update a subsubcategory
router.put("/:id", subsubcategoryController.updateSubsubcategory);

// Delete a subsubcategory
router.delete("/:id", subsubcategoryController.deleteSubsubcategory);

router.get("/sub/sub/:subsubCategoryId", subsubcategoryController.subsubById);

module.exports = router;
