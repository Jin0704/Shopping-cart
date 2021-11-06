const express = require('express')
const router = express.Router()
const passport = require('passport')

//facebook login
router.get('/facebook', passport.authenticate('facebook', {
  scope: 'email'
}))

router.get('/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/',
  failureRedirect: '/sigin'
}))



module.exports = router