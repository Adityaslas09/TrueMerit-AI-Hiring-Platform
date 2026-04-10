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
    date: Date
  }],
  githubUsername: { type: String },
  githubData: {
    publicRepos: Number,
    followers: Number,
    totalCommits: Number, // Computed or fetched
    totalStars: Number,
    topLanguages: Object,
  },
  
  // TrueMerit Score
  trueMeritScore: {
    total: { type: Number, default: 0 },
    githubScore: { type: Number, default: 0 },
    projectScore: { type: Number, default: 0 },
    academicScore: { type: Number, default: 0 },
    certScore: { type: Number, default: 0 }
  }
}, { timestamps: true });

// Password hashing
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
