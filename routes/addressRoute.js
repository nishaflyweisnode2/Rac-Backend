const express = require('express'); 
const addressControllers = require('../controllers/addressController');
const { authJwt, authorizeRoles } = require("../middlewares");

const router = express();



router.post('/',[ [authJwt.verifyToken], addressControllers.addAddress]);
router.get('/',[  addressControllers.getAddress]);
// router.put('/:id',[ addressControllers.updatePolicy]);
// router.delete('/:id',[ addressControllers.DeletePolicy])
router.get('/my/address',[  [authJwt.verifyToken],  addressControllers.getUserAddresses]);
router.put('/update/address/:addressId',[  [authJwt.verifyToken],  addressControllers.updateAddress]);
router.delete('/delete/address/:addressId',[  [authJwt.verifyToken],  addressControllers.deleteAddress]);





module.exports = router;