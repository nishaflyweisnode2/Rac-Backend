const auth = require("../controllers/deviceController");
const { authJwt } = require("../middlewares");
const express = require("express");
const router = express();
// const { authJwt, authorizeRoles } = require("../middlewares");

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

router.post("/add", [authJwt.verifyToken], auth.createDevice);

router.get("/Device/allDevice", auth.getDevice);
router.put("/Device/updateDevice/:id", auth.updateDevice);
router.delete(
  "/Device/deleteDevice/:id",

  auth.removeDevice
);
router.put(
  "/status/enum/:deviceId",

  auth.statusDevice
);
router.put(
  "/status/false/enum/:deviceId",

  auth.statusDeviceFalse
);
router.put(
  "/status/suggestion/:deviceId",

  auth.suggestion
);
router.get("/Device/myDevice/get", [authJwt.verifyToken], auth.myDevice);

module.exports = router;
