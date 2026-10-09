const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { User, Post, Comment } = require('../models');
const env = require('../config/env');

async function listUsers(req, res, next) {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password_hash'] },
            limit: 100
        });
        res.json(users);
    } catch (error) {
        next(error);
    }
}

async function getUser(req, res, next) {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: { exclude: ['password_hash'] },
            include: [
                {
                    model: Post,
                    as: 'posts',
                    attributes: ['id']
                },
                {
                    model: Comment,
                    as: 'comments',
                    attributes: ['id']
                }
            ]
        });

        if (!user) return res.status(404).json({ error: 'User not found' });

        const postsCount = await Post.count({ where: { user_id: user.id } });
        const commentsCount = await Comment.count({ where: { user_id: user.id } });
        const postsLikes = await Post.sum('likes_count', { where: { user_id: user.id } });

        res.json({
            ...user.toJSON(),
            total_posts: postsCount,
            total_comments: commentsCount,
            total_post_likes: postsLikes || 0
        });
    } catch (error) {
        next(error);
    }
}

async function createUser(req, res, next) {
    try {
        const { username, email, password, bio } = req.body;

        const taken = await User.findOne({
            where: { [Op.or]: [{ email }, { username }] }
        });
        if (taken) {
            if (taken.email === email) {
                return res.status(400).json({ error: 'Email already registered' });
            }
            return res.status(400).json({ error: 'Username already taken' });
        }

        const hashedPassword = await bcrypt.hash(password, env.bcryptSaltRounds);

        const user = await User.create({
            username,
            email,
            password_hash: hashedPassword,
            bio: bio || ''
        });

        res.status(201).json({
            id: user.id,
            username: user.username,
            email: user.email
        });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            const field = error.errors?.[0]?.path;
            if (field === 'username') {
                return res.status(400).json({ error: 'Username already taken' });
            }
            return res.status(400).json({ error: 'Email already registered' });
        }
        next(error);
    }
}

module.exports = { listUsers, getUser, createUser };
