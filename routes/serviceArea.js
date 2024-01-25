const express = require('express');
const router = express.Router();
const seviceAreaController = require('../controllers/serviceArea');

router.post('/', seviceAreaController.createSeviceArea);

router.get('/', seviceAreaController.getAllSeviceAreas);

router.get('/:id', seviceAreaController.getSeviceAreaById);

router.put('/:id', seviceAreaController.updateSeviceArea);

router.delete('/:id', seviceAreaController.deleteSeviceArea);

module.exports = router;
