const { StatusCodes } = require('http-status-codes')
const { validationResult } = require('express-validator')
const User = require('../models/User')

exports.register = async (req, res) => {
  const { name, email, password } = req.body
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(StatusCodes.BAD_REQUEST).json({ errors })
  }

  try {
    const user = await User.create({ name, email, password })
    const payload = {
      userID: user._id,
      name: user.name,
    }

    const token = user.generateToken(payload)
    res
      .status(StatusCodes.CREATED)
      .json({ msg: 'User created successfully', token })
  } catch (error) {
    console.error(error)
    if (error.code === 11000) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: 'This Email has already taken' })
    }

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error })
  }
}

exports.login = async (req, res) => {
  const { email, password } = req.body
  const errors = validationResult(req)

  try {
    const user = await User.findOne({ email })
    if (!errors.isEmpty()) {
      return res.status(StatusCodes.BAD_REQUEST).json({ errors })
    }

    if (!user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: 'Invalid credentials' })
    }

    const comparePassword = await user.comparePassword(password)
    if (!comparePassword) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: 'Invalid credentials' })
    }

    const payload = {
      userID: user._id,
      name: user.name,
    }

    const token = user.generateToken(payload)

    res.status(StatusCodes.OK).json({ msg: 'Logged in successfully', token })
  } catch (error) {
    console.error(error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: 'Internal Server Error' })
  }
}
