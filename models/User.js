const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      minlength: [3, 'Name should be at least 3 characters'],
      maxlength: [30, 'Name should be at most 30 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide a name'],
      minlength: [6, 'Email must be at least 6 characters'],
      unique: true,
    },

    password: {
      type: String,
      required: [true, 'Please provide a name'],
      minlength: [6, 'Password should be at least 6 characters'],
    },
  },
  { timestamps: true }
)

UserSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

UserSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password)
}

UserSchema.methods.generateToken = function (payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' })
}

module.exports = mongoose.model('User', UserSchema)
