const jwt = require('jsonwebtoken');
const config = require('./config');

const generateAccessToken = (payload) => {
    return jwt.sign(payload, config.accessKey, {
        expiresIn: config.tokenExpireTime
    });
};
const generateRefreshToken = (payload) => {
    return jwt.sign(payload, config.refreshKey);
};

module.exports = {
    generateAccessToken,
    generateRefreshToken
}