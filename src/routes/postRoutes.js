const express = require('express');
const authenticateToken = require('../middleware/authenticateToken');
const optionalAuthenticate = authenticateToken.optionalAuthenticate;
const {
    listFeed,
    getPost,
    createPost,
    updatePost,
    deletePost
} = require('../controllers/postController');
const { listComments, createComment } = require('../controllers/commentController');
const { likePost, unlikePost } = require('../controllers/likeController');
const validate = require('../middleware/validate');
const { createPostSchema, createCommentSchema, updatePostSchema } = require('../validators/postSchemas');

const router = express.Router();

router.get('/', optionalAuthenticate, listFeed);
router.post('/', authenticateToken, validate(createPostSchema), createPost);
router.get('/:postId/comments', optionalAuthenticate, listComments);
router.post('/:postId/comments', authenticateToken, validate(createCommentSchema), createComment);
router.post('/:postId/like', authenticateToken, likePost);
router.delete('/:postId/unlike', authenticateToken, unlikePost);
router.get('/:id', getPost);
router.put('/:id', authenticateToken, validate(updatePostSchema), updatePost);
router.delete('/:id', authenticateToken, deletePost);

module.exports = router;
