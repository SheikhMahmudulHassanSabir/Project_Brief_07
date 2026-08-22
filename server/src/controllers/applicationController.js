const Application = require('../models/Application');
const Job = require('../models/Job');

// @desc    Apply for a job
// @route   POST /api/applications
// @access  Private/Job-Seeker
exports.applyForJob = async (req, res) => {
  try {
    const { jobId } = req.body;

    if (!jobId) {
      return res.status(400).json({ message: 'Job ID is required' });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job posting not found' });
    }

    // Prevent employers from applying to their own job
    if (job.employer.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot apply to your own job listing' });
    }

    // Check for existing submission
    const alreadyApplied = await Application.findOne({
      job: jobId,
      applicant: req.user._id,
    });

    if (alreadyApplied) {
      return res.status(400).json({ message: 'You have already applied for this position' });
    }

    const application = await Application.create({
      job: jobId,
      applicant: req.user._id,
      status: 'Pending',
    });

    const populatedApp = await Application.findById(application._id)
      .populate('job', 'title companyName location salaryRange category')
      .populate('applicant', 'name email headline skills experienceLevel resumeUrl');

    res.status(201).json(populatedApp);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's submitted applications
// @route   GET /api/applications/my-applications
// @access  Private/Job-Seeker
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate({
        path: 'job',
        select: 'title companyName location salaryRange category',
        populate: { path: 'employer', select: 'name email companyName' },
      })
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all applicants for a specific job
// @route   GET /api/applications/job/:jobId
// @access  Private/Employer/Admin
exports.getJobApplicants = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Verify ownership or admin
    if (job.employer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view applicants for this job' });
    }

    const applicants = await Application.find({ job: jobId })
      .populate('applicant', 'name email headline skills experienceLevel location resumeUrl bio')
      .sort({ createdAt: -1 });

    res.json(applicants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update application status (Pending, Shortlisted, Rejected)
// @route   PUT /api/applications/:id/status
// @access  Private/Employer/Admin
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['Pending', 'Shortlisted', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const application = await Application.findById(req.params.id).populate('job');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Verify employer is the owner of the job
    if (
      application.job.employer.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to update this application status' });
    }

    application.status = status;
    await application.save();

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Withdraw application
// @route   DELETE /api/applications/:id
// @access  Private/Job-Seeker/Admin
exports.withdrawApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (
      application.applicant.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to withdraw this application' });
    }

    await Application.findByIdAndDelete(req.params.id);

    res.json({ message: 'Application withdrawn successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
