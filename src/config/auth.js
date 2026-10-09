const jwt = require('jsonwebtoken');
const env = require('./env');

const JWT_ALGORITHM = 'HS256';
const ACCESS_TOKEN_COOKIE = 'access_token';

function signAccessToken(payload) {
    return jwt.sign(payload, env.jwtSecret, {
        algorithm: JWT_ALGORITHM,
        expiresIn: env.jwtExpiresIn
    });
}

function getAccessTokenCookieOptions() {
    return {
        httpOnly: true,
        secure: env.isProduction,
        sameSite: 'lax',
        path: '/',
        maxAge: env.accessTokenMaxAgeMs
    };
}

module.exports = {
    JWT_ALGORITHM,
    ACCESS_TOKEN_COOKIE,
    signAccessToken,
    getAccessTokenCookieOptions
};
