require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const xss = require('xss-clean')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const { StatusCodes } = require('http-status-codes')

// Auth Middleware import
const authenticateUser = require('./middlewares/auth')

// Rate Limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
})

// connectDB
const connectDB = require('./db/connectDB')

const PORT = process.env.PORT || 5000

// Middlewares
app.use(express.json())
app.use(cors())
app.use(xss())
app.use(helmet())
app.use(limiter)

// Routes
app.use('/api/v1/auth', require('./routes/auth'))
app.use('/api/v1/jobs', authenticateUser, require('./routes/jobs'))

app.all('*', (req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({ msg: 'Not Found.' })
})

const start = async () => {
  await connectDB(process.env.MONGO_URI)
  app.listen(PORT, () => console.log(`Server listening on ${PORT}`))
}

// Start App
start()
