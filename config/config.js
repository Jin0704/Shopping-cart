require('dotenv').config()

const config = {
  "development": {
    "username": process.env.RDS_USERNAME || 'root',
    "password": process.env.RDS_PASSWORD || process.env.MYSQL_PASSWORD,
    "host": process.env.RDS_HOSTNAME || "db",
    "port": process.env.RDS_PORT || 3306,
    "database": process.env.MYSQL_DB,
    "dialect": "mysql"
  },
  "local": {
    "username": "root",
    "password": process.env.MYSQL_PASSWORD,
    "database": process.env.MYSQL_DB,
    "host": "db",
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