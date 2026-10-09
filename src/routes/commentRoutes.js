const express = require('express');
const authenticateToken = require('../middleware/authenticateToken');
const { deleteComment } = require('../controllers/commentController');
const { likeComment, unlikeComment } = require('../controllers/likeController');

const router = express.Router();

router.post('/:id/like', authenticateToken, likeComment);
router.delete('/:id/unlike', authenticateToken, unlikeComment);
router.delete('/:id', authenticateToken, deleteComment);

module.exports = router;
