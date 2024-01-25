const express = require("express");
const router = express.Router();
const jobController = require("../controllers/job.controller")
// const { verifyToken } = require("../middlewares/authJwt");
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
        cloudinary: cloudinary, params: {
                folder: "images/image",
                allowed_formats: ["jpg", "jpeg", "png", "PNG", "xlsx", "xls", "pdf", "PDF"],
        },
});

const upload = multer({ storage: storage });

router.post("/", jobController.createJob);

router.get("/", jobController.getallJobs);

router.get("/:id", jobController.getJobsById);

router.put("/:id", jobController.updateJobsById);

router.put("/images/:id", upload.array('image'), jobController.updateImage);

router.delete("/:id", jobController.deleteJobsById);

module.exports = router;
