const queries = require('../queries');
const AppError = require('../app-error');
const config = require('../config');
const jwt_token = require('../token');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

function signup(request, response) {
    var { username, password } = request.body;
    try {
        if (!username)
            throw new AppError('Registration failed. Username not provided.');
        if (!password)
            throw new AppError('Registration failed. Password not provided.');
    } catch (err) {
        handleRegistrationError(err, response);
    }
    return queries.getUserByUsername(username || '').then(
        result => {
            if (result.rows && result.rows.length > 0) {
                return response.send({
                    success: false,
                    message: 'Registration failed. User with this email already registered.'
                });
            }
            var bcryptPassword = bcrypt.hashSync(password, config.saltRounds)
            return queries.addUserByParams(username, bcryptPassword)
                .then(() => response.send({ success: true }));
        }
    ).catch((err) => { handleRegistrationError(err, response); })
}

function login(request, response) {
    var { username, password } = request.body;
    try {
        if (!username)
            throw new AppError('Authentication failed. Username not provided.');
        if (!password)
            throw new AppError('Authentication failed. Password not provided.');
        return queries.getUserByUsername(username).then(
            (result) => {
                if (result.rows && result.rows.length === 0) {
                    throw new AppError('Authentication failed. User not found.');
                }
                var user = result.rows[0];
                if (!bcrypt.compareSync(password || '', user.password))
                    throw new AppError('Authentication failed. Wrong password.');
                return user;
            }).then((user) => {
                return queries.deleteRefreshTokenByUserId(user.id).then(() => user);
            }).then((user) => {
                const payload = {
                    login: user.username,
                    id: user.id,
                    time: new Date()
                };
                var access_token = jwt_token.generateAccessToken(payload);
                var refresh_token = jwt_token.generateRefreshToken(payload);
                return [user, access_token, refresh_token];
            }).then(([user, access_token, refresh_token]) =>
                queries.addRefreshTokenByParams(user.id, refresh_token).then(() => {
                    return response.send({
                        success: true,
                        data: { accessToken: access_token, refreshToken: refresh_token }
                    });
                })
            ).catch((err) => { handleLoginError(err, response); });
    } catch (err) {
        handleLoginError(err, response);
    }
}

function token(request, response) {
    const refresh_token = request.body.token;
    try {
        if (!refresh_token)
            throw new AppError('Token failed. Refresh token not provided.');
        return queries.getRefreshToken(refresh_token).then(
            result => {
                if (result.rows && result.rows.length === 0) {
                    throw new AppError('Token failed. Refresh token not found.');
                }
                jwt.verify(refresh_token, config.refreshKey, (err, decoded) => {
                    if (err)
                        return response.status(403).send({ auth: false, message: 'Failed to authenticate token.' });
                    /*request.user = {
                        login: decoded.login,
                        id: decoded.id
                    };*/
                    const payload = {
                        login: decoded.login,
                        id: decoded.id,
                        time: new Date()
                    };
                    var access_token = jwt_token.generateAccessToken(payload);
                    response.send({
                        success: true,
                        data: { accessToken: access_token }
                    });
                    //next();
                });
            }
        ).catch((err) => { handleRefreshTokenError(err, response); });
    } catch (err) {
        handleRefreshTokenError(err, response);
    }
}

function logout(request, response) {
    const refresh_token = request.body.token;
    try {
        if (!refresh_token)
            throw new AppError('Logout failed. Refresh token not provided.');
        return queries.getRefreshToken(refresh_token).then(
            result => {
                if (result.rows && result.rows.length === 0) {
                    throw new AppError('Logout failed. Refresh token not found.');
                }
                var data = result.rows[0];
                return queries.deleteRefreshTokenByUserId(data.user_id).then(() => response.sendStatus(204));
            }
        ).catch((err) => { handleLogoutError(err, response); });
    } catch (err) {
        handleLogoutError(err, response);
    }
}


const handleRegistrationError = (err, response) => handleError(err, response, 'Registration failed. Unexpected Error.');

const handleLoginError = (err, response) => handleError(err, response, 'Authentication failed. Unexpected Error.');

const handleRefreshTokenError = (err, response) => handleError(err, response, 'Token failed. Unexpected Error.');

const handleLogoutError = (err, response) => handleError(err, response, 'Logout failed. Unexpected Error.');

const handleError = (err, response, main_message) => {
    console.error(err.message);
    if (err.type === 'app') {
        return response.send({
            success: false,
            message: err.message
        });
    }
    return response.status(500).send({
        success: false,
        message: main_message
    });
}

const verify = (request, response, next) => {
    var authHeader = request.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token)
        return response.status(401).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, config.accessKey, (err, decoded) => {
        if (err)
            return response.status(403).send({ auth: false, message: 'Failed to authenticate token.' });

        request.user = {
            login: decoded.login,
            id: decoded.id
        };
        next();
    });
}

module.exports = {
    verify,
    signup,
    login,
    logout,
    token
}