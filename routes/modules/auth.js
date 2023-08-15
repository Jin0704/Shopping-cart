const express = require('express')
const router = express.Router()
const passport = require('passport')

//facebook login
router.get('/facebook', passport.authenticate('facebook', {
  scope: 'email'
}))

router.get('/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/',
  failureRedirect: '/signin'
}))

//google login
router.get('/google', passport.authenticate('google',{
  scope:['email','profile']
}))

router.get('/google/callback',passport.authenticate('google',{
  successRedirect:'/',
  failureRedirect:'/signin'
}))


module.exports = router