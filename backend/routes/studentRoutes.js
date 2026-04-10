const express = require('express');
const router = express.Router();
const { updateProfile, addProject, getProjects } = require('../controllers/studentController');
const { protect, studentOnly } = require('../middlewares/authMiddleware');

router.route('/profile').put(protect, studentOnly, updateProfile);
router.route('/projects').post(protect, studentOnly, addProject).get(protect, studentOnly, getProjects);

module.exports = router;
