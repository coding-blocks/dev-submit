
const DEV_DB_URL = "postgres://devsubmit:devsubpass@localhost:5432/devsubmitdb"

module.exports = exports = {
  DATABASE_URL: process.env.DATABASE_URL || DEV_DB_URL
}