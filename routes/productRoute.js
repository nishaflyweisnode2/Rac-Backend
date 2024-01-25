const express = require("express");
const router = express.Router();
const productController = require("../controllers/productsController")
const { verifyToken } = require("../middlewares/authJwt");


const { authJwt, authorizeRoles } = require("../middlewares");

const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
cloudinary.config({ cloud_name: "dbrvq9uxa", api_key: "567113285751718", api_secret: "rjTsz9ksqzlDtsrlOPcTs_-QtW4", });
const storage = new CloudinaryStorage({
        cloudinary: cloudinary, params: { folder: "images/image", allowed_formats: ["jpg", "jpeg", "png", "PNG", "xlsx", "xls", "pdf", "PDF"], },
});
const upload = multer({ storage: storage });
var cpUpload = upload.fields([{ name: 'frontImage', maxCount: 1 }, { name: 'backImage', maxCount: 1 },{ name: 'panImage', maxCount: 1 }]);

// Create a new product
router.post("/add/:id",  cpUpload, productController.createProduct);
router.post("/product/:id",  productController.createVendorProduct);
router.get("/my/product/location/:latitude/:longitude",productController.getProductsByUserLocation);


router.get("/", productController.getAllProduct);

// Get a product by ID
router.get("/:id", productController.getProductById);

// Update a product
router.put("/:id", productController.updateProduct);

router.put("/updateProductImages/:id",upload.array('image'), productController.updateProductImages);

router.put("/addProductReview/:id", productController.addProductReview);

// Delete a product
router.delete("/:id", productController.deleteProduct);

module.exports = router;
