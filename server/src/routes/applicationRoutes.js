const express = require('express');
const router = express.Router();
const {
  applyForJob,
  getMyApplications,
  getJobApplicants,
  updateApplicationStatus,
  withdrawApplication,
} = require('../controllers/applicationController');
const { protect, employer } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, applyForJob);

router.route('/my-applications')
  .get(protect, getMyApplications);

router.route('/job/:jobId')
  .get(protect, employer, getJobApplicants);

router.route('/:id/status')
  .put(protect, employer, updateApplicationStatus);

router.route('/:id')
  .delete(protect, withdrawApplication);

module.exports = router;
