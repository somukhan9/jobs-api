const mongoose = require('mongoose')

const JobsSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, 'Please provide a company name'],
    },
    position: {
      type: String,
      required: [true, 'Please provide a postion'],
    },
    status: {
      type: String,
      enum: ['interview', 'declined', 'pending'],
      default: 'pending',
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'user',
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Job', JobsSchema)
