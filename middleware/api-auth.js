const passport = require('passport')
const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) return res.status(401).json({ status: 'error', message: 'unauthorized' })
    // 處理user回req中
    req.user = user
    next()
  })(req, res, next)
}
const authenticatedAdmin = (req, res, next) => {
  const userData = req.user.toJSON()
  if (userData && userData.isAdmin) return next();
  return res.status(403).json({ status: 'error', message: 'permission denied' })
}

module.exports = {
  authenticated,
  authenticatedAdmin
}