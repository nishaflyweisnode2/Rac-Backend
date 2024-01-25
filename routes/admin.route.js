const auth = require("../controllers/admin.controller");
const { authJwt } = require("../middlewares");
const express = require("express");
const router = express()

const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "dbrvq9uxa",
  api_key: "567113285751718",
  api_secret: "rjTsz9ksqzlDtsrlOPcTs_-QtW4",
});
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "images/image",
    allowed_formats: ["jpg", "jpeg", "png", "PNG", "xlsx", "xls", "pdf", "PDF"],
  },
});
const upload = multer({ storage: storage });
var imageUpload = upload.fields([{ name: "image", maxCount: 1 }]);

router.post("/Category/addCategory",auth.createCategory);

router.post("/registration", auth.registration);
router.post("/login", auth.signin);
router.put("/update", [authJwt.verifyToken], auth.update);



router.get("/Category/allCategory", auth.getCategories);
router.put("/Category/updateCategory/:id",  auth.updateCategory);
router.delete("/Category/deleteCategory/:id", [authJwt.verifyToken], auth.removeCategory);
router.post("/SubCategory/addSubCategory",  auth.createSubCategory);
router.get("/SubCategory/allSubCategory", auth.getSubCategories);
router.put("/SubCategory/updateSubCategory/:id", [authJwt.verifyToken], auth.updateSubCategory);
router.delete("/SubCategory/deleteSubCategory/:id", [authJwt.verifyToken], auth.removeSubCategory);

router.get("/sub/cat", auth.getsubofcat);
router.get("/subById/:categoryId", auth.subById);

module.exports = router;