const mongoose = require('mongoose');

const preCheckupSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    price: {
        type: Number,
    },
    status: {
        type: Boolean,
        default: false
    },

});

const PreCheckup = mongoose.model('EndJob', preCheckupSchema);

module.exports = PreCheckup;
