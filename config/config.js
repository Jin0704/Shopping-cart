require('dotenv').config()

const config = {
  "development": {
    "username": process.env.RDS_USERNAME || "root",
    "password": process.env.RDS_PASSWORD || "password",
    "host": process.env.RDS_HOSTNAME || "127.0.0.1",
    "port": process.env.RDS_PORT || "3306",
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
}

module.exports = config