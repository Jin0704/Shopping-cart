const express = require('express')
const router = express.Router()
const UserController = require('../../controllers/api/UserController')

router.post('/signin', UserController.SignIn)
router.post('/signup', UserController.SignUp)

module.exports = router