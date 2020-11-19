require('dotenv').config();

module.exports = {
    port: 3000,
    db: {
        user: process.env.DB_USER,
        host: 'localhost',
        database: 'jwt-auth-api',
        password: process.env.DB_PWD,
        port: 5433,
        max: 20,
        connectionTimeoutMillis: 0,
        idleTimeoutMillis: 0,
    },
    saltRounds: 2,
    accessKey: process.env.ACCESS_64_KEY,
    refreshKey: process.env.REFRESH_64_KEY,
    tokenExpireTime: '15s'
}