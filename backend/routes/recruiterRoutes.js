const express = require('express');
const router = express.Router();
const { getStudents, getStudentById, toggleSaveStudent } = require('../controllers/recruiterController');
const { protect, recruiterOnly } = require('../middlewares/authMiddleware');

router.route('/students').get(protect, recruiterOnly, getStudents);
router.route('/students/:id').get(protect, recruiterOnly, getStudentById);
router.route('/students/:id/save').post(protect, recruiterOnly, toggleSaveStudent);

module.exports = router;
