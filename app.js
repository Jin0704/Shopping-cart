const express = require('express')
const exphbs = require('express-handlebars')
const methodoverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')
const cookieParser = require('cookie-parser')
const path = require('path')
const passport = require('passport')
require('./config/passport')
const app = express()
const port = process.env.PORT || 3000

app.engine('.hbs', exphbs({ defaultLayout: 'main', extname: 'hbs' }))
app.set('view engine', 'hbs')

app.use(express.urlencoded({ extended: true }))
app.use(methodoverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))
app.use('/upload', express.static(__dirname + '/upload'))
app.use(cookieParser());
app.use(session({
  secret: 'shopping-cart',
  name: 'shopping-cart',
  resave: false,
  cookie: { maxAge: 80000 },
  saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
//req.flash
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = req.user
  next()
})


app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})




require('./routes')(app, passport)


module.exports = app