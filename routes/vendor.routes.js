const { validateUser } = require("../middlewares");
const auth = require("../controllers/vendor.controller");
const { authJwt, authorizeRoles } = require("../middlewares");

const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
cloudinary.config({ cloud_name: "dbrvq9uxa", api_key: "567113285751718", api_secret: "rjTsz9ksqzlDtsrlOPcTs_-QtW4", });
const storage = new CloudinaryStorage({
        cloudinary: cloudinary, params: { folder: "images/image", allowed_formats: ["jpg", "jpeg", "png", "PNG", "xlsx", "xls", "pdf", "PDF"], },
});
const upload = multer({ storage: storage });
var cpUpload = upload.fields([{ name: 'frontImage', maxCount: 1 }, { name: 'backImage', maxCount: 1 },{ name: 'pic', maxCount: 1 },{ name: 'panCard', maxCount: 1 }]);


const express = require("express");
const router = express()
router.post("/registrationVendor", auth.registrationVendor);
router.post("/loginWithPhoneVendor", auth.loginWithPhoneVendor);
router.post("/:id", auth.verifyOtpVendor);
router.post("/resend/otp", auth.resendOTPVendor);
router.get("/getProfileVendor", [authJwt.vendorverifyToken], auth.getProfileVendor);
router.put("/updateLocationVendor", [authJwt.vendorverifyToken], auth.updateLocationVendor);
router.delete("/deleteUserById/:id",auth.deleteUserById);
router.put("/updateFileAndDocumentVendor/:id", [authJwt.vendorverifyToken], cpUpload, auth.updateFileAndDocumentVendor);

router.post("/helpers/:id", cpUpload,   auth.addHelpers);
router.get("/helpers/get", [authJwt.vendorverifyToken],  auth.getHelpers);
router.get("/helpers/all",   auth.getAllHelpers);
router.put("/vendor/editProfile", [authJwt.vendorverifyToken], auth.editvendorProfile);

router.get("/earning/:vendorId", auth.totalEarn);

router.put("/update/area/:vendorId", auth.updateAreaAndDistance);

router.get("/filter/:vendorId", auth.filterTotal);


module.exports = router;



