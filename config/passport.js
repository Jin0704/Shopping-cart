const passport = require('passport')
const passportJWY = require('passport-jwt')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const JWTStrategy = passportJWY.Strategy
const ExtractJWT = passportJWY.ExtractJwt
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const Product = db.Product
require('dotenv').config()

passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  (req, email, password, done) => {
    User.findOne({ where: { email } })
      .then(user => {
        if (!user) {
          return done(null, false, req.flash('error_messages', '該使用者不存在'))
        }
        if (!bcrypt.compareSync(password, user.password)) {
          return done(null, false, req.flash('error_messages', 'Email 或 密碼輸入錯誤'))
        }
        return done(null, user)
      })
  }))

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.findByPk(id, {
    include: [
      { model: Product, as: 'FavoritedProducts' }
    ]
  })
    .then((user) => {
      user = user.toJSON()
      done(null, user)
    }).catch(err => done(err, null))
})

// jwt
const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}
// jwt strategy
passport.use(new JWTStrategy(jwtOptions, (jwtPayload, cb) => {
  User.findByPk(jwtPayload.id, {
    include: [
      { model: Product, as: 'FavoritedProducts' }
    ]
  })
    .then(user => cb(null, user))
    .catch(err => cb(err))
}))

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: process.env.FACEBOOK_CALLBACK,
  profileFields: ['email']
}, (accessToken, refreshToken, profile, done) => {
  // console.log(profile)
  const { email } = profile._json
  User.findOne({ where: { email: email } })
    .then(user => {
      if (user) return done(null, user)
      const randomPassword = Math.random().toString(36).slice(-8)
      bcrypt.genSalt(6)
        .then(salt => bcrypt.hashSync(randomPassword, salt))
        .then(hash => User.create({
          email: email,
          password: hash
        }))
        .then(user => done(null, user))
        .catch(err => done(err, false))
    })
}
))


module.exports = passport