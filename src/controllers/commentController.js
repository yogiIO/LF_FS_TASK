const { User, Post, Comment, Like } = require('../models');
const { serializeComment } = require('../serializers');

async function listComments(req, res, next) {
    try {
        const comments = await Comment.findAll({
            where: { post_id: req.params.postId },
            include: [
                {
                    model: User,
                    as: 'author',
                    attributes: ['id', 'username', 'profile_picture_url']
                },
                ...(req.user ? [{
                    model: Like,
                    as: 'likes',
                    attributes: ['id'],
                    required: false,
                    where: { user_id: req.user.id, post_id: null }
                }] : [])
            ],
            order: [['created_at', 'DESC']]
        });

        res.json(comments.map(serializeComment));
    } catch (error) {
        next(error);
    }
}

async function createComment(req, res, next) {
    try {
        const { content } = req.body;

        const post = await Post.findByPk(req.params.postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const comment = await Comment.create({
            post_id: req.params.postId,
            user_id: req.user.id,
            content
        });

        res.status(201).json({
            id: comment.id,
            content: comment.content
        });
    } catch (error) {
        next(error);
    }
}

async function deleteComment(req, res, next) {
    try {
        const comment = await Comment.findByPk(req.params.id);

        if (!comment) return res.status(404).json({ error: 'Comment not found' });
        if (comment.user_id !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        await comment.destroy();
        res.json({ message: 'Comment deleted' });
    } catch (error) {
        next(error);
    }
}

module.exports = { listComments, createComment, deleteComment };
