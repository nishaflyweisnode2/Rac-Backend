const mongoose = require('mongoose');

const preCheckupSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    status: {
        type: Boolean,
        default: false
    },

});

const PreCheckup = mongoose.model('PreCheckup', preCheckupSchema);

module.exports = PreCheckup;
