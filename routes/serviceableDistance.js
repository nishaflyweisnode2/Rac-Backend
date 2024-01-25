const express = require('express');
const router = express.Router();
const seviceDistController = require('../controllers/serviceableDistance');

router.post('/', seviceDistController.createSeviceArea);

router.get('/', seviceDistController.getAllSeviceAreas);

router.get('/:id', seviceDistController.getSeviceAreaById);

router.put('/:id', seviceDistController.updateSeviceArea);

router.delete('/:id', seviceDistController.deleteSeviceArea);

module.exports = router;
