require('dotenv').config()

const config = {
  "development": {
    "username": process.env.RDS_USERNAME,
    "password": process.env.RDS_PASSWORD,
    "host": process.env.RDS_HOSTNAME,
    "port": process.env.RDS_PORT,
    "database": "shopping_cart",
    "dialect": "mysql"
  },
  "local": {
    "username": "root",
    "password": "password",
    "database": "shopping_cart",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "use_env_variable": "CLEARDB_URL",
    "dialectOptions": {
      "ssl": {
        "rejectUnauthorized": false
      }
    }
  },
  // "rds": {
  //   "username": process.env.RDS_USERNAME,
  //   "password": process.env.RDS_PASSWORD,
  //   "host": process.env.RDS_HOSTNAME,
  //   "port": process.env.RDS_PORT,
  //   "database": "shopping_cart",
  //   "dialect": "mysql"
  // }
}

module.exports = config