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
  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ msg: 'Token missing' })
  }

  try {
    const { userID, name } = jwt.verify(token, process.env.JWT_SECRET)
    req.user = {
      userID,
      name,
    }
    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        msg: 'Session timed out. Please login again',
      })
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        msg: 'Invalid token. Try again',
      })
    }
    console.error(error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: 'Internal server error' })
  }
}

module.exports = authenticateUser
