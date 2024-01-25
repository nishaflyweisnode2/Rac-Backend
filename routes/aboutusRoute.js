const express = require('express'); 
const aboutus = require('../controllers/aboutusController');
const aboutusRouter = express.Router()


//ADMIN
aboutusRouter.post('/',   aboutus.addaboutus);
aboutusRouter.get('/',   aboutus.getAllaboutus);
aboutusRouter.get('/:id',   aboutus.getaboutusById);
aboutusRouter.put('/:id', aboutus.updateaboutus);
aboutusRouter.delete('/:id', aboutus.Deleteaboutus);

module.exports = aboutusRouter;