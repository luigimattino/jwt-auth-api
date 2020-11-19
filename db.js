const Pool = require('pg').Pool
const config = require('./config');
const pool = new Pool({
  user: config.db.user,
  host: config.db.host,
  database: config.db.database,
  password: config.db.password,
  port: config.db.port,
  max: config.db.max,
  connectionTimeoutMillis: config.db.connectionTimeoutMillis,
  idleTimeoutMillis: config.db.idleTimeoutMillis
})
module.exports = pool;