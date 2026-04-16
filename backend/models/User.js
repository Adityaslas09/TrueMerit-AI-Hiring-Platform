const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'recruiter'], required: true },
  
  // Recruiter specific details
  savedCandidates: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  // Student specific details
  college: { type: String },
  cgpa: { type: Number },
  skills: [{ type: String }],
  certifications: [{
    name: String,
    issuer: String,
    date: Date,
    imageBase64: String,      // Base64 encoded certificate image
    imageType: String,         // MIME type (image/jpeg, image/png, application/pdf)
    verificationStatus: {      // AI verification result
      type: String,
      enum: ['pending', 'verified', 'suspicious', 'fake'],
      default: 'pending'
    },
    verificationScore: { type: Number, default: 0 },
    verificationDetails: { type: String, default: '' },
  }],
  resumeText: {
    type: String,
  },
  linkedinText: {
    type: String,
  },
  githubUsername: { type: String },
  githubData: {
    publicRepos: Number,
    followers: Number,
    totalCommits: Number, // Computed or fetched
    totalStars: Number,
    topLanguages: Object,
  },
  
  // TrueMerit Score (Data Scientist AI Evaluation)
  trueMeritScore: {
    total: { type: Number, default: 0 },
    githubScore: { type: Number, default: 0 },
    projectScore: { type: Number, default: 0 },
    academicScore: { type: Number, default: 0 },
    certScore: { type: Number, default: 0 },
    insight: { type: String, default: 'Pending AI Analysis' }
  }
}, { timestamps: true });

// Password hashing (Mongoose 9 async middleware — no next() parameter)
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Phase 3 Scalability Indexes
userSchema.index({ role: 1, 'trueMeritScore.total': -1 });
userSchema.index({ skills: 1 });

const User = mongoose.model('User', userSchema);
module.exports = User;
