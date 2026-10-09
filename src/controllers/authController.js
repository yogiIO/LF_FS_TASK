const bcrypt = require('bcryptjs');
const { User } = require('../models');
const {
    ACCESS_TOKEN_COOKIE,
    signAccessToken,
    getAccessTokenCookieOptions
} = require('../config/auth');

async function login(req, res, next) {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        let passwordMatches = false;
        try {
            passwordMatches = await bcrypt.compare(password, user.password_hash);
        } catch {
            passwordMatches = false;
        }

        if (!passwordMatches) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = signAccessToken({ id: user.id });
        res.cookie(ACCESS_TOKEN_COOKIE, token, getAccessTokenCookieOptions());

        return res.json({
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                profile_picture_url: user.profile_picture_url
            }
        });
    } catch (error) {
        return next(error);
    }
}

function logout(req, res) {
    res.clearCookie(ACCESS_TOKEN_COOKIE, getAccessTokenCookieOptions());
    return res.json({ message: 'Logged out' });
}

async function getProfile(req, res, next) {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: ['id', 'username', 'email', 'profile_picture_url']
        });
        if (!user) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }
        return res.json({ user });
    } catch (error) {
        return next(error);
    }
}

module.exports = { login, logout, getProfile };
