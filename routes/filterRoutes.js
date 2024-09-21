const express = require('express');
const { filterTasks, saveFilter, loadFilters } = require('../controllers/filterController');
const authenticate = require('../middleware/filtermiddleware'); // Your authentication middleware

const router = express.Router();

router.use(authenticate); // Protect all routes below with authentication

router.get('/tasks/filter', filterTasks); // Filtering tasks
router.post('/filters', saveFilter); // Save custom filter
router.get('/filters', loadFilters); // Load custom filters

module.exports = router;
