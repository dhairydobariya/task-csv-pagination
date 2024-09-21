const Filter = require('../model/filterModel');
const Task = require('../model/taskmodel'); // Make sure to import the Task model

const filterTasks = async (req, res) => {
    try {
        const { status, priority, dueDate, assignedTo } = req.query; // Get filter criteria from query params
        const filters = {};

        if (status) filters.status = status;
        if (priority) filters.priority = priority;
        if (dueDate) filters.dueDate = { $gte: new Date(dueDate) }; // Only future due dates
        if (assignedTo) filters.assignedTo = assignedTo;

        const tasks = await Task.find(filters);
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error filtering tasks', error });
    }
};

// Save custom filter
const saveFilter = async (req, res) => {
    try {
        const { filterName, criteria } = req.body;
        const userId = req.user._id; // Assuming you have user authentication

        // Validate input
        if (!filterName || !criteria) {
            return res.status(400).json({ message: 'Filter name and criteria are required' });
        }

        const newFilter = new Filter({ userId, filterName, criteria });
        await newFilter.save();

        res.status(201).json({ message: 'Filter saved successfully', filter: newFilter });
    } catch (error) {
        console.error('Error saving filter:', error); // Log the error details
        res.status(500).json({ message: 'Error saving filter', error: error.message }); // Send error message
    }
};

// Load custom filters for a user
const loadFilters = async (req, res) => {
    try {
        const userId = req.user._id; // Assuming you have user authentication
        const filters = await Filter.find({ userId });

        res.status(200).json(filters);
    } catch (error) {
        res.status(500).json({ message: 'Error loading filters', error });
    }
};

module.exports = { filterTasks, saveFilter, loadFilters };
