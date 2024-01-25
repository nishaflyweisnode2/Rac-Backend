const express = require("express");
const router = express.Router();
const seviceNameController = require("../controllers/service");
const { isAdmin } = require("../middlewares/authJwt");

router.post("/", seviceNameController.createSevice);

router.get("/", seviceNameController.getAllSevice);

router.get("/:id", seviceNameController.getSeviceById);

router.put("/:id", isAdmin, seviceNameController.updateSevice);

router.delete("/:id", isAdmin, seviceNameController.deleteSevice);

router.get("/search/all", seviceNameController.search);
router.get("/minimum/price/:categoryId", seviceNameController.minimumPrice);

router.get("/service/sub/:serviceId", seviceNameController.getsubsubbyservice);
router.get("/service/items/:serviceId", seviceNameController.getItems);

router.get("/service/by/sub/:subCategoryId", seviceNameController.getServicesBySubCategoryId);
router.put("/update/type/:serviceId", seviceNameController.updateServiceType);
router.get("/popular/:type", seviceNameController.getServicesByType);




module.exports = router;

