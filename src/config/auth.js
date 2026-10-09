const jwt = require('jsonwebtoken');

const JWT_ALGORITHM = 'HS256';
const JWT_EXPIRES_IN = '7d';
const ACCESS_TOKEN_COOKIE = 'access_token';
const ACCESS_TOKEN_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

function getJwtSecret() {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is not set');
    }
    return secret;
}

function signAccessToken(payload) {
    return jwt.sign(payload, getJwtSecret(), {
        algorithm: JWT_ALGORITHM,
        expiresIn: JWT_EXPIRES_IN
    });
}

function getAccessTokenCookieOptions() {
    return {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: ACCESS_TOKEN_MAX_AGE_MS
    };
}

module.exports = {
    JWT_ALGORITHM,
    JWT_EXPIRES_IN,
    ACCESS_TOKEN_COOKIE,
    getJwtSecret,
    signAccessToken,
    getAccessTokenCookieOptions
};
