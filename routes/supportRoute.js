const express = require('express'); 
const supports = require('../controllers/supportController');
const { authJwt, authorizeRoles } = require("../middlewares");
const { validateUser } = require("../middlewares");
const auth = require("../controllers/user.controller");
const router = express();
// const authJwt= require("../middleware/authJwt");

router.post('/', [ [authJwt.vendorverifyToken],  supports.createSupport]);
router.get('/', [  supports.getAllSupport]);
router.post('/reply/:supportId',[  supports.replySupport]);

router.delete('/:id',[  supports.deleteSupport]);
module.exports = router;