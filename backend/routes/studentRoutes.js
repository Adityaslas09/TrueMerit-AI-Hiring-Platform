const express = require('express');
const router = express.Router();
const { updateProfile, addProject, getProjects, uploadLinkedinPdf, uploadCertificate } = require('../controllers/studentController');
const { protect, studentOnly } = require('../middlewares/authMiddleware');

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.route('/profile').put(protect, studentOnly, updateProfile);
router.route('/projects').post(protect, studentOnly, addProject).get(protect, studentOnly, getProjects);
router.route('/upload-linkedin').post(protect, studentOnly, upload.single('linkedinPdf'), uploadLinkedinPdf);
router.route('/upload-certificate').post(protect, studentOnly, upload.single('certificateImage'), uploadCertificate);

module.exports = router;
