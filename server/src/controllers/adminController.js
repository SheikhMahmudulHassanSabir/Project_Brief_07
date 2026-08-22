const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');

// @desc    Get Admin System KPI Metrics
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'job-seeker' });
    const totalEmployers = await User.countDocuments({ role: 'employer' });
    const totalJobs = await Job.countDocuments();
    const totalApplications = await Application.countDocuments();

    const recentUsers = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentApplications = await Application.find()
      .populate('job', 'title companyName')
      .populate('applicant', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      metrics: {
        totalUsers,
        totalEmployers,
        totalJobs,
        totalApplications,
      },
      recentUsers,
      recentApplications,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users for user management
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user account
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If user is employer, delete all their jobs and associated applications
    if (user.role === 'employer') {
      const employerJobs = await Job.find({ employer: user._id });
      const jobIds = employerJobs.map((j) => j._id);
      await Application.deleteMany({ job: { $in: jobIds } });
      await Job.deleteMany({ employer: user._id });
    } else {
      // If job seeker, delete all their applications
      await Application.deleteMany({ applicant: user._id });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User and all associated records deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all jobs for moderation
// @route   GET /api/admin/jobs
// @access  Private/Admin
exports.getAllJobsForModeration = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate('employer', 'name email companyName')
      .sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
