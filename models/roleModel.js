const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        default: ''
    }
});

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        default: ''
    },
    language: [{
        type: String,
        default: ''
    }],
    permissions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Permission'
        }
    ]
});

const Permission = mongoose.model('Permission', permissionSchema);
const Role = mongoose.model('Role', roleSchema);

module.exports = { Permission, Role };
