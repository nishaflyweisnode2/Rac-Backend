const mongoose = require('mongoose');

const professionalSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: "user",
    },
    firstName: {
        type: String,
    },
    lastName: String,
    profession: {
        type: mongoose.Schema.ObjectId,
        ref: "subsubcategory",
    },
    experience: {
        type: String,
    },
    mobile: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
    },
    city: {
        type: String,
    },
    landmark: String,
    state: {
        type: String,
    },
    pincode: {
        type: String,
    },
    otherDetails: String
});

const Professional = mongoose.model('Professional', professionalSchema);

module.exports = Professional;
