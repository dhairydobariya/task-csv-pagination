const mongoose = require('mongoose');

const filterSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }, // Reference to the user
    filterName: { type: String, required: true }, // Name of the custom filter
    criteria: { // The filter criteria
        status: { type: String },
        priority: { type: String },
        dueDate: { type: Date },
        assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Reference to the user assigned
    },
}, { timestamps: true });

const Filter = mongoose.model('Filter', filterSchema);
module.exports = Filter;
