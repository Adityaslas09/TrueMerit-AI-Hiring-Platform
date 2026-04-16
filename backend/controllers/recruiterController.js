const User = require('../models/User');
const { generateInterviewQuestionsAdvanced, matchJobDescription, parseRecruiterQuery, evaluateResumeAuthenticity, analyzeLinkedInProfile } = require('../services/aiService');
const Project = require('../models/Project');
const { getFromCache, setToCache, invalidateCacheByPrefix } = require('../services/cacheService');

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
    
    const cacheKey = `students:page${page}:skill${req.query.skill || 'none'}:saved${req.query.savedOnly || 'false'}:user${req.user._id}`;
    const cachedData = getFromCache(cacheKey);
    if (cachedData) {
      return res.json(cachedData);
    }
    if (req.query.skill) {
      if (req.query.skill.split(' ').length > 2) {
         // Agent 4: Intelligent NLP Hiring Assistant parsing
         const nlpFilter = await parseRecruiterQuery(req.query.skill);
         if (nlpFilter && nlpFilter.filters?.skills?.length > 0) {
            match.skills = { $in: nlpFilter.filters.skills.map(skill => new RegExp(skill, 'i')) };
         }
      } else {
         match.skills = { $regex: req.query.skill, $options: 'i' };
      }
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

    const responseData = { students: mappedStudents, page, pages: Math.ceil(count / pageSize) };
    setToCache(cacheKey, responseData);
    res.json(responseData);
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
    
    // Invalidate pipeline cache
    invalidateCacheByPrefix('students:');

    res.json({ isSaved: !isSaved, message: !isSaved ? 'Student saved' : 'Student removed from saved' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate Questions
// @route   GET /api/recruiters/students/:id/generate-questions
// @access  Private (Recruiter)
const generateQuestions = async (req, res) => {
  try {
    const student = await User.findById(req.params.id);
    if (!student || student.role !== 'student') return res.status(404).json({ message: 'Student not found' });
    
    // Fetch their portfolio projects to feed to the AI Context
    const projects = await Project.find({ student: student._id });
    
    const questions = await generateInterviewQuestionsAdvanced(student, projects);
    // Flatten question types into a unified array for the frontend backward compatibility
    const flatQuestions = [
      ...(questions.technical_questions || []),
      ...(questions.coding_questions || []),
      ...(questions.scenario_questions || [])
    ];
    res.json({ questions: flatQuestions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Match Job Description
// @route   POST /api/recruiters/students/:id/match-job
// @access  Private (Recruiter)
const matchJob = async (req, res) => {
  try {
    const { jobDescription } = req.body;
    if (!jobDescription) return res.status(400).json({ message: 'Job Description is required' });
    
    const student = await User.findById(req.params.id);
    if (!student || student.role !== 'student') return res.status(404).json({ message: 'Student not found' });
    
    const matchData = await matchJobDescription(student, jobDescription);
    res.json(matchData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify Resume Authenticity
// @route   POST /api/recruiters/students/:id/verify-resume
// @access  Private (Recruiter)
const verifyResume = async (req, res) => {
  try {
    const student = await User.findById(req.params.id);
    if (!student || student.role !== 'student') return res.status(404).json({ message: 'Student not found' });
    
    const verificationData = await evaluateResumeAuthenticity(student.resumeText || '', student.githubData || {});
    res.json(verificationData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Analyze LinkedIn Profile
// @route   GET /api/recruiters/students/:id/analyze-linkedin
// @access  Private (Recruiter)
const analyzeLinkedin = async (req, res) => {
  try {
    const student = await User.findById(req.params.id);
    if (!student || student.role !== 'student') return res.status(404).json({ message: 'Student not found' });
    
    if (!student.linkedinText) {
       return res.status(400).json({ message: 'Candidate has not uploaded a LinkedIn Profile yet.' });
    }

    const linkedInData = await analyzeLinkedInProfile(student.linkedinText, student.resumeText || '');
    res.json(linkedInData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getStudents, getStudentById, toggleSaveStudent, generateQuestions, matchJob, verifyResume, analyzeLinkedin };
