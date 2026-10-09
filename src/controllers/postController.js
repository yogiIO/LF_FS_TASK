const { Op } = require('sequelize');
const { User, Post, Comment, Like } = require('../models');
const { serializePost } = require('../serializers');

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 50;

function parsePagination(query) {
    const page = Math.max(Number.parseInt(query.page, 10) || 1, 1);
    const limit = Math.min(
        Math.max(Number.parseInt(query.limit, 10) || DEFAULT_PAGE_SIZE, 1),
        MAX_PAGE_SIZE
    );
    return { page, limit, offset: (page - 1) * limit };
}

function currentUserLikeInclude(req, { onPost = true } = {}) {
    if (!req.user) return [];

    return [{
        model: Like,
        as: 'likes',
        attributes: ['id'],
        required: false,
        where: onPost
            ? { user_id: req.user.id, comment_id: null }
            : { user_id: req.user.id, post_id: null }
    }];
}

async function listFeed(req, res, next) {
    try {
        const { page, limit, offset } = parsePagination(req.query);

        const { rows, count } = await Post.findAndCountAll({
            include: [
                {
                    model: User,
                    as: 'author',
                    attributes: ['id', 'username', 'profile_picture_url']
                },
                {
                    model: Comment,
                    as: 'comments',
                    attributes: ['id']
                },
                ...currentUserLikeInclude(req)
            ],
            order: [['created_at', 'DESC']],
            limit,
            offset,
            distinct: true
        });

        res.json({
            posts: rows.map(post => serializePost(post)),
            page,
            limit,
            total: count,
            total_pages: Math.ceil(count / limit) || 0
        });
    } catch (error) {
        next(error);
    }
}

async function getPost(req, res, next) {
    try {
        const post = await Post.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    as: 'author',
                    attributes: ['id', 'username', 'profile_picture_url']
                },
                {
                    model: Comment,
                    as: 'comments',
                    include: [
                        {
                            model: User,
                            as: 'author',
                            attributes: ['id', 'username', 'profile_picture_url']
                        }
                    ]
                }
            ]
        });

        if (!post) return res.status(404).json({ error: 'Post not found' });

        res.json(serializePost(post, { includeComments: true }));
    } catch (error) {
        next(error);
    }
}

async function createPost(req, res, next) {
    try {
        const { title, content, image_url } = req.body;

        const post = await Post.create({
            user_id: req.user.id,
            title,
            content,
            image_url: image_url || null
        });

        res.status(201).json({
            id: post.id,
            title: post.title,
            content: post.content
        });
    } catch (error) {
        next(error);
    }
}

async function updatePost(req, res, next) {
    try {
        const post = await Post.findByPk(req.params.id);

        if (!post) return res.status(404).json({ error: 'Post not found' });
        if (post.user_id !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        const patch = {};
        if (req.body.title !== undefined) patch.title = req.body.title;
        if (req.body.content !== undefined) patch.content = req.body.content;
        await post.update(patch);

        res.json({ message: 'Post updated' });
    } catch (error) {
        next(error);
    }
}

async function deletePost(req, res, next) {
    try {
        const post = await Post.findByPk(req.params.id);

        if (!post) return res.status(404).json({ error: 'Post not found' });
        if (post.user_id !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        await post.destroy();
        res.json({ message: 'Post deleted' });
    } catch (error) {
        next(error);
    }
}

async function getTrending(req, res, next) {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const posts = await Post.findAll({
            where: {
                created_at: { [Op.gte]: sevenDaysAgo }
            },
            include: [
                {
                    model: User,
                    as: 'author',
                    attributes: ['id', 'username']
                },
                {
                    model: Comment,
                    as: 'comments',
                    attributes: ['id']
                }
            ],
            order: [['likes_count', 'DESC']],
            limit: 20
        });

        res.json(posts.map(post => serializePost(post)));
    } catch (error) {
        next(error);
    }
}

async function searchPosts(req, res, next) {
    try {
        const { q } = req.query;

        if (!q || q.trim().length === 0) {
            return res.status(400).json({ error: 'Search query required' });
        }

        const posts = await Post.findAll({
            where: {
                [Op.or]: [
                    { title: { [Op.like]: `%${q}%` } },
                    { content: { [Op.like]: `%${q}%` } }
                ]
            },
            include: [
                {
                    model: User,
                    as: 'author',
                    attributes: ['username']
                }
            ],
            order: [['created_at', 'DESC']],
            limit: 20
        });

        res.json(posts.map(post => serializePost(post)));
    } catch (error) {
        next(error);
    }
}

module.exports = {
    listFeed,
    getPost,
    createPost,
    updatePost,
    deletePost,
    getTrending,
    searchPosts
};
