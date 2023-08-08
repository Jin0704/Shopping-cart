const express = require('express')
const router = express.Router()
const UserController = require('../../controllers/api/UserController')
const { authenticated, authenticatedAdmin } = require('../../middleware/api-auth')
router.post('/signin', UserController.SignIn)
router.post('/signup', UserController.SignUp)
router.use(authenticated)
router.get('/favorites', UserController.getFavoritesPage)
router.post('/favorites/:productId', UserController.addFavorite)
router.delete('/favorites/:productId', UserController.removeFavorite)

module.exports = router