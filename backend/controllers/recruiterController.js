const User = require('../models/User');
const Project = require('../models/Project');

// @desc    Get all students (search/filter/sort)
// @route   GET /api/recruiters/students
// @access  Private (Recruiter)
const getStudents = async (req, res) => {
  try {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;
    const recruiter = await User.findById(req.user._id);

    // Filter by skill if provided
    const match = { role: 'student' };
    if (req.query.skill) {
      match.skills = { $regex: req.query.skill, $options: 'i' };
    }

    if (req.query.savedOnly === 'true') {
      match._id = { $in: recruiter.savedCandidates };
    }

    const count = await User.countDocuments(match);
    
    // Sort by Total Score Descending default
    const students = await User.find(match)
      .select('-password')
      .sort({ 'trueMeritScore.total': -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    const mappedStudents = students.map(s => ({
      ...s.toObject(),
      isSaved: recruiter.savedCandidates.includes(s._id)
    }));

    res.json({ students: mappedStudents, page, pages: Math.ceil(count / pageSize) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get student by ID with projects
// @route   GET /api/recruiters/students/:id
// @access  Private (Recruiter)
const getStudentById = async (req, res) => {
  try {
    const student = await User.findById(req.params.id).select('-password');
    if (student && student.role === 'student') {
      const projects = await Project.find({ student: student._id });
      const recruiter = await User.findById(req.user._id);
      const isSaved = recruiter.savedCandidates.includes(student._id);

      res.json({ student, projects, isSaved });
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle save student for recruiter
// @route   POST /api/recruiters/students/:id/save
// @access  Private (Recruiter)
const toggleSaveStudent = async (req, res) => {
  try {
    const recruiter = await User.findById(req.user._id);
    const studentId = req.params.id;

    const isSaved = recruiter.savedCandidates.includes(studentId);

    if (isSaved) {
      recruiter.savedCandidates.pull(studentId);
    } else {
      recruiter.savedCandidates.push(studentId);
    }

    await recruiter.save();
    res.json({ isSaved: !isSaved, message: !isSaved ? 'Student saved' : 'Student removed from saved' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getStudents, getStudentById, toggleSaveStudent };
