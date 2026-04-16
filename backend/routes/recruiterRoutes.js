const express = require('express');
const router = express.Router();
const { getStudents, getStudentById, toggleSaveStudent, generateQuestions, matchJob, verifyResume, analyzeLinkedin } = require('../controllers/recruiterController');
const { protect, recruiterOnly } = require('../middlewares/authMiddleware');

router.route('/students').get(protect, recruiterOnly, getStudents);
router.route('/students/:id').get(protect, recruiterOnly, getStudentById);
router.route('/students/:id/save').post(protect, recruiterOnly, toggleSaveStudent);
router.route('/students/:id/generate-questions').get(protect, recruiterOnly, generateQuestions);
router.route('/students/:id/match-job').post(protect, recruiterOnly, matchJob);
router.route('/students/:id/verify-resume').post(protect, recruiterOnly, verifyResume);
router.route('/students/:id/analyze-linkedin').get(protect, recruiterOnly, analyzeLinkedin);

module.exports = router;
