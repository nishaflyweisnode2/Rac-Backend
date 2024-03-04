const express = require("express");
const router = express()
const { validateUser } = require("../middlewares");
const auth = require("../controllers/user.controller");
const { authJwt, authorizeRoles } = require("../middlewares");

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

router.post("/registration", auth.registration);
router.post("/loginWithPhone", auth.loginWithPhone);
router.post("/:id", auth.verifyOtp);
router.post("/resendOtp/:id", auth.resendOTP);
router.get("/getProfile", [authJwt.verifyToken], auth.getProfile);
router.put("/updateLocation", [authJwt.verifyToken], auth.updateLocation);
router.put("/editProfile", [authJwt.verifyToken], auth.editProfile);
router.put("/uploadSelfie", upload.single('file'), [authJwt.verifyToken], auth.uploadSelfie)

router.get("/near/shop", auth.nearbyShop)

router.get('/notifications/user', [authJwt.verifyToken], auth.getNotificationsForUser);
router.put('/notifications/:notificationId', [authJwt.verifyToken], auth.markNotificationAsRead);

module.exports = router;