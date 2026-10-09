const { sequelize, Post, Comment, Like } = require('../models');

function clientError(status, message) {
    const error = new Error(message);
    error.status = status;
    return error;
}

function handleLikeError(error, next, res) {
    if (error.status) {
        return res.status(error.status).json({ error: error.message });
    }
    if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ error: 'Already liked' });
    }
    return next(error);
}

async function likePost(req, res, next) {
    try {
        await sequelize.transaction(async (transaction) => {
            const post = await Post.findByPk(req.params.postId, {
                transaction,
                lock: transaction.LOCK.UPDATE
            });
            if (!post) {
                throw clientError(404, 'Post not found');
            }

            const existingLike = await Like.findOne({
                where: {
                    user_id: req.user.id,
                    post_id: post.id,
                    comment_id: null
                },
                transaction
            });
            if (existingLike) {
                throw clientError(400, 'Already liked');
            }

            await Like.create({
                user_id: req.user.id,
                post_id: post.id
            }, { transaction });
            await post.increment('likes_count', { transaction });
        });

        res.status(201).json({ message: 'Post liked' });
    } catch (error) {
        handleLikeError(error, next, res);
    }
}

async function unlikePost(req, res, next) {
    try {
        await sequelize.transaction(async (transaction) => {
            const post = await Post.findByPk(req.params.postId, {
                transaction,
                lock: transaction.LOCK.UPDATE
            });
            if (!post) {
                throw clientError(404, 'Post not found');
            }

            const like = await Like.findOne({
                where: {
                    user_id: req.user.id,
                    post_id: post.id,
                    comment_id: null
                },
                transaction
            });
            if (!like) {
                throw clientError(404, 'Like not found');
            }

            await like.destroy({ transaction });
            if (post.likes_count > 0) {
                await post.decrement('likes_count', { transaction });
            }
        });

        res.json({ message: 'Post unliked' });
    } catch (error) {
        handleLikeError(error, next, res);
    }
}

async function likeComment(req, res, next) {
    try {
        await sequelize.transaction(async (transaction) => {
            const comment = await Comment.findByPk(req.params.id, {
                transaction,
                lock: transaction.LOCK.UPDATE
            });
            if (!comment) {
                throw clientError(404, 'Comment not found');
            }

            const existingLike = await Like.findOne({
                where: {
                    user_id: req.user.id,
                    comment_id: comment.id,
                    post_id: null
                },
                transaction
            });
            if (existingLike) {
                throw clientError(400, 'Already liked');
            }

            await Like.create({
                user_id: req.user.id,
                comment_id: comment.id,
                post_id: null
            }, { transaction });
            await comment.increment('likes_count', { transaction });
        });

        res.status(201).json({ message: 'Comment liked' });
    } catch (error) {
        handleLikeError(error, next, res);
    }
}

async function unlikeComment(req, res, next) {
    try {
        await sequelize.transaction(async (transaction) => {
            const comment = await Comment.findByPk(req.params.id, {
                transaction,
                lock: transaction.LOCK.UPDATE
            });
            if (!comment) {
                throw clientError(404, 'Comment not found');
            }

            const like = await Like.findOne({
                where: {
                    user_id: req.user.id,
                    comment_id: comment.id,
                    post_id: null
                },
                transaction
            });
            if (!like) {
                throw clientError(404, 'Like not found');
            }

            await like.destroy({ transaction });
            if (comment.likes_count > 0) {
                await comment.decrement('likes_count', { transaction });
            }
        });

        res.json({ message: 'Comment unliked' });
    } catch (error) {
        handleLikeError(error, next, res);
    }
}

module.exports = { likePost, unlikePost, likeComment, unlikeComment };
