const mongoose = require('mongoose');

const idCardSchema = new mongoose.Schema({
    partnerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    image: {
        type: String,
    },
    name: {
        type: String,
    },
    jobTitle: {
        type: String,
    },
    idNumber: {
        type: String,
    },
    department: {
        type: String,
    },
    designation: {
        type: String,
    },
    phoneNumber: {
        type: String,
    },
    email: {
        type: String,
    },
    fileName: {
        type: String,
    },
    filePath: {
        type: String,
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    }
});

const IDCard = mongoose.model('IDCard', idCardSchema);

module.exports = IDCard;
