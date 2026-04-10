const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  githubLink: { type: String },
  liveLink: { type: String },
  techStack: [{ type: String }],
  
  // Mock AI Evaluation
  aiComplexityScore: { type: Number, default: 0 }, // 0 to 10
  aiFeedback: { type: String }
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;
