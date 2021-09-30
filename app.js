const express = require('express')
const exphbs = require('express-handlebars')
const methodoverride = require('method-override')
const path = require('path')
const app = express()
const port = 3000

app.engine('.hbs', exphbs({ defaultLayout: 'main', extname: 'hbs' }))
app.set('view engine', 'hbs')

app.use(express.urlencoded({ extended: true }))
app.use(methodoverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))

app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})




require('./routes')(app)


module.exports = app