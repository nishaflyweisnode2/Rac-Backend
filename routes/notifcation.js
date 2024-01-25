const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notifcation');


const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
cloudinary.config({ cloud_name: "dbrvq9uxa", api_key: "567113285751718", api_secret: "rjTsz9ksqzlDtsrlOPcTs_-QtW4", });
const storage = new CloudinaryStorage({
        cloudinary: cloudinary, params: { folder: "images/image", allowed_formats: ["jpg", "jpeg", "png", "PNG", "xlsx", "xls", "pdf", "PDF"], },
});
const upload = multer({ storage: storage });
var cpUpload = upload.fields([{ name: 'Image', maxCount: 1 }]);

// Route to get all notifications
router.get('/', notificationController.getAllNotifications);

// Route to get a single notification by ID
router.get('/:id', notificationController.getNotificationById);

// Route to create a new notification
router.post('/',cpUpload, notificationController.createNotification);

// Route to update an existing notification by ID
router.put('/:id', cpUpload,notificationController.updateNotificationById);

// Route to delete a notification by ID
router.delete('/:id', notificationController.deleteNotificationById);

module.exports = router;
