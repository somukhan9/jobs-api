const { StatusCodes } = require('http-status-codes')
const jwt = require('jsonwebtoken')

const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: 'Unauthorized user' })
  }
  const token = authHeader.split(' ')[1]
  try {
    const { userID, name } = jwt.verify(token, process.env.JWT_SECRET)
    req.user = {
      userID,
      name,
    }
    next()
  } catch (error) {
    console.error(error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: 'Internal server error' })
  }
}

module.exports = authenticateUser
