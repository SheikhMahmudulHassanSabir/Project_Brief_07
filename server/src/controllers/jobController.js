const Job = require('../models/Job');
const Application = require('../models/Application');

// @desc    Get all jobs (with optional search query and category filters)
// @route   GET /api/jobs
// @access  Public
exports.getJobs = async (req, res) => {
  try {
    const { search, category, location } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } },
      ];
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    const jobs = await Job.find(query)
      .populate('employer', 'name email companyName companyWebsite')
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      'employer',
      'name email companyName companyWebsite companySize industry'
    );
    if (!job) {
      return res.status(404).json({ message: 'Job vacancy not found' });
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get jobs posted by the logged-in employer
// @route   GET /api/jobs/my-jobs
// @access  Private/Employer
exports.getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ employer: req.user._id }).sort({ createdAt: -1 });
    
    // Attach applicant count to each job
    const jobsWithCounts = await Promise.all(
      jobs.map(async (job) => {
        const applicantCount = await Application.countDocuments({ job: job._id });
        const shortlistedCount = await Application.countDocuments({ job: job._id, status: 'Shortlisted' });
        return {
          ...job.toObject(),
          applicantCount,
          shortlistedCount,
        };
      })
    );

    res.json(jobsWithCounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new job posting
// @route   POST /api/jobs
// @access  Private/Employer/Admin
exports.createJob = async (req, res) => {
  try {
    const { title, description, category, location, salaryRange, requirements, companyName } = req.body;

    if (!title || !description || !category || !location) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    let parsedRequirements = [];
    if (Array.isArray(requirements)) {
      parsedRequirements = requirements;
    } else if (typeof requirements === 'string' && requirements.trim()) {
      parsedRequirements = requirements.split(',').map((r) => r.trim()).filter(Boolean);
    }

    const job = await Job.create({
      title,
      description,
      category,
      location,
      salaryRange: salaryRange || 'Competitive',
      requirements: parsedRequirements,
      employer: req.user._id,
      companyName: companyName || req.user.companyName || req.user.name,
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a job posting
// @route   PUT /api/jobs/:id
// @access  Private/Employer/Admin
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Ensure owner or admin
    if (job.employer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to modify this job' });
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a job posting
// @route   DELETE /api/jobs/:id
// @access  Private/Employer/Admin
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Ensure owner or admin
    if (job.employer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this job' });
    }

    await Job.findByIdAndDelete(req.params.id);
    // Also remove any related applications
    await Application.deleteMany({ job: req.params.id });

    res.json({ message: 'Job posting and associated applications removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
