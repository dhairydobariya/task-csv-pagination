const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    taskname: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ['pending', 'complete'],
        default: 'pending'
    },
    description: {
        type: String,
        required: true
    },
    createdby: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    category: {
        type: String
    },
    dueDate: { // New field for due date
        type: Date,
        required: true,
        validate: {
            validator: function(value) {
                return value >= Date.now(); // Ensures due date is not in the past
            },
            message: 'Due date cannot be in the past'
        }
    }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
