const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const routes = require("./routes");
const methodoverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const path = require("path");
const passport = require("passport");
// redis init
const redis = require("./redis");
redis.connectRedis();
// winston
const winston = require("winston");
const expressWinston = require("express-winston");

require("./config/passport");
const port = process.env.PORT || 3000;
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

app.engine(
  ".hbs",
  exphbs({
    defaultLayout: "main",
    extname: "hbs",
    helpers: require("./config/handlebars_helpers"),
  })
);
app.set("view engine", "hbs");
app.use(express.urlencoded({ extended: true }));
app.use(methodoverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use("/upload", express.static(__dirname + "/upload"));
app.use(cookieParser());
app.use(
  session({
    secret: "shopping-cart",
    name: "shopping-cart",
    resave: false,
    cookie: { maxAge: 80000 },
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(flash());
//req.flash
app.use((req, res, next) => {
  res.locals.success_messages = req.flash("success_messages");
  res.locals.error_messages = req.flash("error_messages");
  res.locals.user = req.user;
  next();
});

app.listen(port, () => {
  // //同步資料庫
  // db.sequelize.sync()
  console.log(`http://localhost:${port}`);
});

// use winston
app.use(
  expressWinston.logger({
    transports: [
      new winston.transports.File({ filename: "./logs/access.log" }),
    ],
    format: winston.format.simple(),
    meta: true, // optional: control whether you want to log the meta data about the request (default to true)
    msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
    expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
    colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
    ignoreRoute: function (req, res) {
      return false;
    },
  })
);

app.use(routes);
// require('./routes')(app, passport)

module.exports = app;
