const mongoose = require("mongoose"); 

const timeslotSchema = mongoose.Schema({
    timeslot: {
        type: String
    }
})

const timeslot  = mongoose.model('timeslot', timeslotSchema);

module.exports = timeslot