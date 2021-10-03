const express = require('express')
const exphbs = require('express-handlebars')
const methodoverride = require('method-override')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const path = require('path')
const app = express()
const port = 3000

app.engine('.hbs', exphbs({ defaultLayout: 'main', extname: 'hbs' }))
app.set('view engine', 'hbs')

app.use(express.urlencoded({ extended: true }))
app.use(methodoverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(cookieParser());
app.use(session({
  secret: 'shopping-cart',
  name: 'shopping-cart',
  resave: false,
  cookie: { maxAge: 80000 },
  saveUninitialized: true
}))


app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})




require('./routes')(app)


module.exports = app