require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET; 
const User = require('../model/usermodel');
const Task = require('../model/taskmodel');

const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const { parse } = require('json2csv');
const csvParser = require('csv-parser');
const path = require('path');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const fastcsv = require('fast-csv');

const defaults = (req, res) => {
    res.send("It's the default route, please sign in");
};

const register = async (req, res) => {
    const { name, password, roll } = req.body;

    console.log(req.body); // For debugging
    
    try {
        // Trim spaces from user inputs
        const trimmedName = name.trim();
        const trimmedPassword = password.trim();
        const trimmedRoll = roll.trim();

        const hashedPassword = await bcrypt.hash(trimmedPassword, 10);
        const user = new User({ name: trimmedName, password: hashedPassword, roll: trimmedRoll });
        await user.save();
        
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error); // Log error details for debugging
        res.status(500).json({ message: 'Server Error' });
    }
};



const login = async (req, res) => {
    const { name, password } = req.body;
    try {
        const user = await User.findOne({ name });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ data: user }, secret);
        res.cookie('token', token, { httpOnly: true });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const addTaskForUser = async (req, res) => {
    const { taskname, description, status, category, dueDate } = req.body;
    const userId = req.user._id; 
    
    try {
        const dueDateParsed = new Date(dueDate);
        if (dueDateParsed < Date.now()) {
            return res.status(400).json({ message: 'Due date cannot be in the past.' });
        }

        const task = new Task({
            taskname,
            description,
            status,
            createdby: userId,
            assignedTo: userId, 
            category,
            dueDate: dueDateParsed
        });

        await task.save();
        res.status(201).json({ message: 'Task added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const addTaskForAdmin = async (req, res) => {
    const { taskname, description, status, category, assignedTo, dueDate } = req.body;
    const userId = req.user._id; 

    try {
        const dueDateParsed = new Date(dueDate);
        if (dueDateParsed < Date.now()) {
            return res.status(400).json({ message: 'Due date cannot be in the past.' });
        }

        const createdBy = assignedTo ? assignedTo : userId;

        const task = new Task({
            taskname,
            description,
            status,
            createdby: userId,
            assignedTo: createdBy,
            category,
            dueDate: dueDateParsed
        });

        await task.save();
        res.status(201).json({ message: 'Task added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const gettasks = async (req, res) => {
    try {
        const filter = req.user.roll === 'admin' ? {} : { assignedTo: req.user._id };
        const tasks = await Task.find(filter);
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const updatetasks = async (req, res) => {
    const { id } = req.params;
    const { taskname, description, status, category } = req.body;

    try {
        const task = await Task.findById(id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        if (req.user.roll !== 'admin' && task.assignedTo.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Forbidden: You can only update your own tasks' });
        }

        const updatedTask = await Task.findByIdAndUpdate(id, { taskname, description, status, category }, { new: true });
        res.status(200).json({ message: 'Task updated successfully', updatedTask });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const deletetask = async (req, res) => {
    const { id } = req.params;
    try {
        const task = await Task.findById(id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        if (req.user.roll !== 'admin' && task.assignedTo.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Forbidden: You can only delete your own tasks' });
        }

        await Task.findByIdAndDelete(id);
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const updateTaskByAdmin = async (req, res) => {
    const { id } = req.params;
    const { taskname, description, status, category, assignedTo } = req.body;

    try {
        const task = await Task.findById(id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        const updatedTask = await Task.findByIdAndUpdate(id, { taskname, description, status, category, assignedTo }, { new: true });
        res.status(200).json({ message: 'Task updated successfully', updatedTask });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const deleteTaskByAdmin = async (req, res) => {
    const { id } = req.params;
    try {
        const task = await Task.findById(id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        await Task.findByIdAndDelete(id);
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, roll } = req.body;
    try {
        const updatedUser = await User.findByIdAndUpdate(id, { name, roll }, { new: true });
        if (!updatedUser) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User updated successfully', updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        await User.findByIdAndDelete(id);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};


const exportTasksToCSV = async (req, res) => {
    try {
        const tasks = await Task.find().lean();

        if (!tasks || tasks.length === 0) {
            return res.status(404).json({ message: 'No tasks found' });
        }

        const csvFilePath = path.join(__dirname, '..', 'uploads', 'tasks.csv');

        const csvFields = ['taskname', 'description', 'status', 'category', 'createdby', 'assignedTo', 'dueDate']; // Include dueDate

        const ws = fs.createWriteStream(csvFilePath);

        fastcsv
            .write(tasks, { headers: csvFields })
            .on('finish', () => {
                res.download(csvFilePath, 'tasks.csv', (err) => {
                    if (err) {
                        res.status(500).json({ message: 'Error downloading file' });
                    }
                });
            })
            .pipe(ws);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};



// Function to import tasks from CSV
const importTasksFromCSV = async (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const results = [];
    fs.createReadStream(req.file.path)
        .pipe(csvParser())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
            try {
                const BATCH_SIZE = 100; // Adjust as needed
                const userId = req.user._id;
                const skippedTasks = []; // Array to store skipped tasks

                console.log('Parsed Results:', results); // Log parsed results

                for (let i = 0; i < results.length; i += BATCH_SIZE) {
                    const tasksBatch = results.slice(i, i + BATCH_SIZE).map(task => ({
                        taskname: task.taskname,
                        description: task.description,
                        status: task.status || 'pending',
                        createdby: userId,
                        assignedTo: req.user.roll === 'admin' && task.assignedTo ? task.assignedTo : userId,
                        category: task.category,
                        dueDate: new Date(task.dueDate) // Ensure dueDate is properly formatted
                    }));

                    // Check for duplicates based on taskname for the same user
                    const existingTasks = await Task.find({
                        createdby: userId,
                        $or: tasksBatch.map(t => ({ taskname: t.taskname }))
                    });

                    // Create a set of existing task names for fast lookup
                    const existingTaskNames = new Set(existingTasks.map(t => t.taskname));

                    // Filter out duplicates and collect skipped tasks
                    tasksBatch.forEach(t => {
                        if (existingTaskNames.has(t.taskname)) {
                            skippedTasks.push(t); // Add to skipped tasks
                        }
                    });

                    const uniqueTasks = tasksBatch.filter(t => !existingTaskNames.has(t.taskname));

                    // Insert only unique tasks
                    if (uniqueTasks.length > 0) {
                        await Task.insertMany(uniqueTasks);
                    }
                }

                console.log('Skipped Tasks:', skippedTasks); // Log skipped tasks

                res.status(201).json({
                    message: 'Tasks imported successfully',
                    skippedTasks // Include skipped tasks in the response
                });
            } catch (error) {
                console.error('Error importing tasks:', error); // Log any errors
                res.status(500).json({ message: 'Error importing tasks', error });
            }
        });
};










const exportAllTasksToCSV = async (req, res) => {
    try {
        const tasks = await Task.find();  // Get all tasks from DB

        if (!tasks || tasks.length === 0) {
            return res.status(404).json({ message: 'No tasks found' });
        }

        const csvFilePath = path.join(__dirname, '..', 'uploads', 'tasks.csv');  // Save CSV in /exports directory

        // Create a writable stream
        const ws = fs.createWriteStream(csvFilePath);

        // Define CSV fields
        const csvFields = ['taskname', 'description', 'status', 'category', 'createdby', 'assignedTo'];

        // Use fast-csv to write CSV
        fastcsv
            .write(tasks, { headers: csvFields })
            .on('finish', () => {
                res.download(csvFilePath, 'tasks.csv', (err) => {
                    if (err) {
                        res.status(500).json({ message: 'Error downloading file' });
                    }
                });
            })
            .pipe(ws);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const getPaginatedTasks = async (req, res) => {
    const { page = 1, limit = 10 } = req.query; // Default: page 1 and limit 10

    try {
        const tasks = await Task.find({ createdby: req.user._id })
            .skip((page - 1) * limit) // Skip records for pagination
            .limit(parseInt(limit)) // Limit the number of records returned
            .sort({ dueDate: 1 }); // Optionally, sort by dueDate or another field

        const totalTasks = await Task.countDocuments({ createdby: req.user._id });

        res.status(200).json({
            tasks,
            currentPage: page,
            totalPages: Math.ceil(totalTasks / limit),
            totalTasks
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching paginated tasks', error });
    }
};




module.exports = {
    defaults,
    register,
    login,
    addTaskForUser,
    addTaskForAdmin,
    gettasks,
    updatetasks,
    deletetask,
    getAllTasks,
    updateTaskByAdmin,
    deleteTaskByAdmin,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    exportTasksToCSV,
    importTasksFromCSV,
    getPaginatedTasks
};
