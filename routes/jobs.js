const express = require('express')
const JobsController = require('../controllers/jobs')

const router = express.Router()

router.route('/').post(JobsController.createJob).get(JobsController.getAllJobs)
router
  .route('/:id')
  .get(JobsController.getJob)
  .patch(JobsController.updateJob)
  .delete(JobsController.deleteJob)

module.exports = router
