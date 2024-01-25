const express = require('express'); 
const timeslot = require('../controllers/timeslotController');
const timeslotRouter = express.Router()


//ADMIN
timeslotRouter.post('/',   timeslot.addtimeslot);
timeslotRouter.get('/',   timeslot.getAlltimeslot);
timeslotRouter.get('/:id',   timeslot.gettimeslotById);
timeslotRouter.put('/:id', timeslot.updatetimeslot);
timeslotRouter.delete('/:id', timeslot.Deletetimeslot);

module.exports = timeslotRouter;