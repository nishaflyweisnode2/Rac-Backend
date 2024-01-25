const express = require('express');
const router = express.Router();
const cityController = require('../controllers/selectcity');

// CREATE a new city
router.post('/:name', cityController.createCity);

// READ all cities
router.get('/', cityController.getCity);

// UPDATE a city
router.put('/:id', cityController.updateCity);

// DELETE a city
router.delete('/:id', cityController.deleteCity);

module.exports = router;
