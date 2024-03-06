const auth = require("../controllers/admin.controller");
const { authJwt } = require("../middlewares");
const express = require("express");
const router = express()

const { IdCard, } = require('../middlewares/imageUpload');


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

router.post("/Category/addCategory", auth.createCategory);

router.post("/registration", auth.registration);
router.post("/login", auth.signin);
router.put("/update", [authJwt.isAdmin], auth.update);
router.get("/alluser", [authJwt.isAdmin], auth.getAllUser);
router.get('/users/:userId', [authJwt.isAdmin], auth.getUserById);
router.delete('/users/:userId', [authJwt.isAdmin], auth.deleteUserById);
router.put('/users/:userId', [authJwt.isAdmin], auth.updateUserById);
router.post("/createUser", auth.createUser);


router.get("/Category/allCategory", auth.getCategories);
router.put("/Category/updateCategory/:id", auth.updateCategory);
router.delete("/Category/deleteCategory/:id", [authJwt.isAdmin], auth.removeCategory);
router.post("/SubCategory/addSubCategory", auth.createSubCategory);
router.get("/SubCategory/allSubCategory", auth.getSubCategories);
router.get("/SubCategory/allSubCategory/category/:id", auth.getSubCategoriesByCategoryId);
router.put("/SubCategory/updateSubCategory/:id", [authJwt.isAdmin], auth.updateSubCategory);
router.delete("/SubCategory/deleteSubCategory/:id", [authJwt.isAdmin], auth.removeSubCategory);

router.get("/sub/cat", auth.getsubofcat);
router.get("/sub/bycat/:id", auth.getSubcategoriesByCategoryID);
router.get("/sub/bysubcat/:id", auth.getSubcategoriesBySubcategoryID);
router.get("/subById/:categoryId", auth.subById);


router.post('/precheckups', [authJwt.isAdmin], auth.createPreCheckup);
router.get('/precheckups', /*[authJwt.isAdmin],*/ auth.getAllPreCheckups);
router.get('/precheckups/:id', /*[authJwt.isAdmin],*/ auth.getPreCheckupById);
router.put('/precheckups/:id', [authJwt.isAdmin], auth.updatePreCheckup);
router.delete('/precheckups/:id', [authJwt.isAdmin], auth.deletePreCheckup);



router.post('/endJob', [authJwt.isAdmin], auth.createEndJob);
router.get('/endJob', /*[authJwt.isAdmin],*/ auth.getAllEndJob);
router.get('/endJob/:id', /*[authJwt.isAdmin],*/ auth.getEndJobById);
router.put('/endJob/:id', [authJwt.isAdmin], auth.updateEndJob);
router.delete('/endJob/:id', [authJwt.isAdmin], auth.deleteEndJob);


//vendor
router.get("/getAllVendor", [authJwt.isAdmin], auth.getAllVendor);


router.post('/todo', [authJwt.isAdmin], auth.createTodoItem);
router.get('/todo', [authJwt.isAdmin], auth.getAllTodoItems);
router.get('/todo/:id', [authJwt.isAdmin], auth.getTodoItemById);
router.put('/todo/:id', [authJwt.isAdmin], auth.updateTodoItemById);
router.delete('/todo/:id', [authJwt.isAdmin], auth.deleteTodoItemById);


router.post('/notifications', [authJwt.isAdmin], auth.createNotification);
router.get('/notifications/user/:userId', [authJwt.isAdmin], auth.getNotificationsForUser);
router.get('/notifications', [authJwt.isAdmin], auth.getAllNotifications);
router.delete('/notifications/:id', [authJwt.isAdmin], auth.deleteNotification);

router.post('/permissions', [authJwt.isAdmin], auth.createPermission);
router.get('/permissions', [authJwt.isAdmin], auth.getAllPermissions);
router.put('/permissions/:id', [authJwt.isAdmin], auth.updatePermission);
router.delete('/permissions/:id', [authJwt.isAdmin], auth.deletePermission);

router.post('/roles', [authJwt.isAdmin], auth.createRole);
router.get('/roles', [authJwt.isAdmin], auth.getAllRoles);
router.put('/roles/:id', [authJwt.isAdmin], auth.updateRole);
router.delete('/roles/:id', [authJwt.isAdmin], auth.deleteRole);

router.post('/id-cards', [authJwt.isAdmin], IdCard.single('image'), auth.createIDCard);
router.get('/id-cards', [authJwt.isAdmin], auth.getAllIDCards);
router.get('/id-cards/:id', [authJwt.isAdmin], auth.getIDCardById);
router.put('/id-cards/:id', [authJwt.isAdmin], IdCard.single('image'), auth.updateIDCardById);
router.delete('/id-cards/:id', [authJwt.isAdmin], auth.deleteIDCardById);


module.exports = router;