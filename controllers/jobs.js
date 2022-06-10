const { StatusCodes } = require('http-status-codes')
const Jobs = require('../models/Jobs')

exports.getAllJobs = async (req, res) => {
  const { userID } = req.user
  try {
    const jobs = await Jobs.find({ createdBy: userID }).select('-__v')
    res.status(StatusCodes.OK).json({ jobs, count: jobs.length })
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: 'Internal server error' })
  }
}

exports.getJob = async (req, res) => {
  const { id: jobID } = req.params
  const { userID } = req.user
  try {
    const job = await Jobs.findOne({ _id: jobID, createdBy: userID })
    if (!job) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: 'Job not found' })
    }
    res.status(StatusCodes.OK).json({ job })
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: 'Internal server error' })
  }
}

exports.createJob = async (req, res) => {
  const { company, position } = req.body
  const { userID } = req.user
  try {
    const job = await Jobs.create({ company, position, createdBy: userID })
    res
      .status(StatusCodes.CREATED)
      .json({ msg: 'Job created successfully', job })
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: 'Internal server error' })
  }
}

exports.updateJob = async (req, res) => {
  const { id: jobID } = req.params
  const { userID } = req.user
  const { company, position } = req.body

  if (!company || !position) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: 'Please provide company and position' })
  }
  try {
    const job = await Jobs.findByIdAndUpdate(
      { _id: jobID, createdBy: userID },
      req.body,
      { new: true }
    )
    if (!job) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: 'Job not found' })
    }
    res.status(StatusCodes.OK).json({ msg: 'Job updated successfully', job })
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: 'Internal server error' })
  }
}

exports.deleteJob = async (req, res) => {
  const { id: jobID } = req.params
  const { userID } = req.user

  try {
    const job = await Jobs.findByIdAndRemove({ _id: jobID, createdBy: userID })
    if (!job) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: 'Job not found' })
    }
    res.status(StatusCodes.OK).json({ msg: 'Job deleted succesfully', job })
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: 'Internal server error' })
  }
}
