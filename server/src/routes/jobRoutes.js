const express = require('express');
const router = express.Router();
const {
  getJobs,
  getJobById,
  getMyJobs,
  createJob,
  updateJob,
  deleteJob,
} = require('../controllers/jobController');
const { protect, employer } = require('../middleware/authMiddleware');

router.route('/')
  .get(getJobs)
  .post(protect, employer, createJob);

router.route('/my-jobs')
  .get(protect, employer, getMyJobs);

router.route('/:id')
  .get(getJobById)
  .put(protect, employer, updateJob)
  .delete(protect, employer, deleteJob);

module.exports = router;
