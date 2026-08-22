const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['job-seeker', 'employer', 'admin'], default: 'job-seeker' },
  // Job Seeker Profile Fields
  headline: { type: String, default: '' },
  skills: [{ type: String }],
  experienceLevel: { type: String, default: '' },
  resumeUrl: { type: String, default: '' },
  // Employer Profile Fields
  companyName: { type: String, default: '' },
  companyWebsite: { type: String, default: '' },
  industry: { type: String, default: '' },
  companySize: { type: String, default: '' },
  // Common Profile Fields
  location: { type: String, default: '' },
  bio: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
