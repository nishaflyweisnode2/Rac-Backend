const express = require('express');
const router = express.Router();
const auth = require('../controllers/notifcation');
const { authJwt } = require("../middlewares");


const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
cloudinary.config({ cloud_name: "dbrvq9uxa", api_key: "567113285751718", api_secret: "rjTsz9ksqzlDtsrlOPcTs_-QtW4", });
const storage = new CloudinaryStorage({
        cloudinary: cloudinary, params: { folder: "images/image", allowed_formats: ["jpg", "jpeg", "png", "PNG", "xlsx", "xls", "pdf", "PDF"], },
});
const upload = multer({ storage: storage });
var cpUpload = upload.fields([{ name: 'Image', maxCount: 1 }]);

router.post('/notifications', [authJwt.verifyToken], auth.createNotification);
router.put('/notifications/:notificationId', [authJwt.verifyToken], auth.markNotificationAsRead);
router.get('/notifications/user', [authJwt.verifyToken], auth.getNotificationsForUser);

module.exports = router;
