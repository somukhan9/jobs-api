const express = require('express')
const { body } = require('express-validator')
const AuthController = require('../controllers/auth')

const router = express.Router()

// Registration Validation
const registrationValidator = [
  body(
    'name',
    'Please provide a name and should be at least 3 characters long'
  ),
  body('email', 'Please provide a valid email').isEmail(),
  body(
    'password',
    'Please provide a password and should be at least 6 characters long'
  ).isLength({ min: 6 }),
]

// Login Validation
const loginValidator = [
  body('email', 'Please provide a valid email').isEmail().escape(),
  body('password', 'Please provide a password').isLength({ min: 1 }),
]

// Auth Routes
router.post('/register', registrationValidator, AuthController.register)
router.post('/login', loginValidator, AuthController.login)

module.exports = router
