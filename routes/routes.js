const express = require('express');
const route = express();
const controller = require('../controllers/controller');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../multer/multer');


route.get('/', controller.defaults);
route.post('/register', controller.register);
route.post('/login', controller.login);


route.post('/tasks/user', authMiddleware(['user']), controller.addTaskForUser);
route.get('/tasks', authMiddleware(['user', 'admin']), controller.gettasks);
route.patch('/tasks/:id', authMiddleware(['user', 'admin']), controller.updatetasks);
route.delete('/tasks/:id', authMiddleware(['user', 'admin']), controller.deletetask);

route.post('/tasks/admin', authMiddleware(['admin']), controller.addTaskForAdmin);
route.get('/tasks/admin', authMiddleware(['admin']), controller.getAllTasks);
route.patch('/tasks/admin/:id', authMiddleware(['admin']), controller.updateTaskByAdmin);
route.delete('/tasks/admin/:id', authMiddleware(['admin']), controller.deleteTaskByAdmin);

route.get('/users', authMiddleware(['admin']), controller.getAllUsers);
route.get('/users/:id', authMiddleware(['admin']), controller.getUserById);
route.patch('/users/:id', authMiddleware(['admin']), controller.updateUser);
route.delete('/users/:id', authMiddleware(['admin']), controller.deleteUser);


route.get('/tasks/export', authMiddleware(['user', 'admin']), controller.exportTasksToCSV);
route.post('/tasks/import', authMiddleware(['user', 'admin']), upload.single('file'), controller.importTasksFromCSV);


route.get('/paginated-tasks', authMiddleware(['user', 'admin']), controller.getPaginatedTasks);



module.exports = route;
