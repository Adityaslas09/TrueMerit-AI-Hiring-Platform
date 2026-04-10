const User = require('../models/User');
const Project = require('../models/Project');
const { fetchGithubData } = require('../services/githubService');
const { calculateScore } = require('../services/scoringEngine');
const { evaluateProject } = require('../services/aiService');

// @desc    Update student profile & sync github
// @route   PUT /api/students/profile
// @access  Private (Student)
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user && user.role === 'student') {
      user.name = req.body.name || user.name;
      user.college = req.body.college || user.college;
      user.cgpa = req.body.cgpa || user.cgpa;
      user.skills = req.body.skills || user.skills;
      
      if (req.body.githubUsername && req.body.githubUsername !== user.githubUsername) {
        user.githubUsername = req.body.githubUsername;
        // Fetch new github data
        const ghData = await fetchGithubData(req.body.githubUsername);
        if(ghData) {
           user.githubData = ghData;
        }
      }

      // Recalculate score after profile update
      const projects = await Project.find({ student: user._id });
      user.trueMeritScore = calculateScore(user, projects);

      const updatedUser = await user.save();
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a project
// @route   POST /api/students/projects
// @access  Private (Student)
const addProject = async (req, res) => {
  try {
    const { title, description, githubLink, liveLink, techStack } = req.body;

    // Real AI evaluation using Gemini
    const aiEval = await evaluateProject(description, techStack || []);

    const project = new Project({
      student: req.user._id,
      title,
      description,
      githubLink,
      liveLink,
      techStack,
      aiComplexityScore: aiEval.aiComplexityScore,
      aiFeedback: aiEval.aiFeedback
    });

    const createdProject = await project.save();

    // Recalculate User Score
    const user = await User.findById(req.user._id);
    const projects = await Project.find({ student: user._id });
    user.trueMeritScore = calculateScore(user, projects);
    await user.save();

    res.status(201).json(createdProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get student projects
// @route   GET /api/students/projects
// @access  Private (Student)
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ student: req.user._id });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { updateProfile, addProject, getProjects };
