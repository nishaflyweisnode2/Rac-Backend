const mongoose = require('mongoose');

const todoItemSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    completed: {
        type: Boolean,
        default: false
    },
    reminderDate: {
        type: Date,
        default: null
    },
    reminderSet: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });

const TodoItem = mongoose.model('TodoItem', todoItemSchema);

module.exports = TodoItem;
