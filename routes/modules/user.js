const express = require('express')
const router = express.Router()
const UserController = require('../../controllers/admin/user')
const UserService = require('../../services/admin/user')
const db  = require('../../models')

const userService = new UserService(db)
const userController = new UserController(userService)
router.get('/', userController.findAll)
router.get('/:id', userController.findOne)
// router.delete('/:id', promotionController.delete)


module.exports = router