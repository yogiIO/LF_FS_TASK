const jwt = require('jsonwebtoken');
const { JWT_ALGORITHM, ACCESS_TOKEN_COOKIE, getJwtSecret } = require('../config/auth');

function readAccessToken(req) {
    const cookieToken = req.cookies && req.cookies[ACCESS_TOKEN_COOKIE];
    if (cookieToken) {
        return cookieToken;
    }

    const header = req.headers.authorization;
    if (header && header.startsWith('Bearer ')) {
        return header.slice('Bearer '.length).trim();
    }

    return null;
}

function attachUserFromToken(token) {
    const payload = jwt.verify(token, getJwtSecret(), {
        algorithms: [JWT_ALGORITHM]
    });
    if (!payload || payload.id == null) {
        return null;
    }
    return { id: payload.id };
}

function authenticateToken(req, res, next) {
    const token = readAccessToken(req);
    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    try {
        const user = attachUserFromToken(token);
        if (!user) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        return next();
    } catch (err) {
        if (err.message === 'JWT_SECRET is not set') {
            return next(err);
        }
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}

function optionalAuthenticate(req, res, next) {
    const token = readAccessToken(req);
    if (!token) {
        return next();
    }

    try {
        const user = attachUserFromToken(token);
        if (user) {
            req.user = user;
        }
    } catch (err) {
        if (err.message === 'JWT_SECRET is not set') {
            return next(err);
        }
    }

    return next();
}

module.exports = authenticateToken;
module.exports.optionalAuthenticate = optionalAuthenticate;
