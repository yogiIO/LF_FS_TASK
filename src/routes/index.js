const express = require('express');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const postRoutes = require('./postRoutes');
const commentRoutes = require('./commentRoutes');
const { getTrending, searchPosts } = require('../controllers/postController');

const router = express.Router();

router.use(authRoutes);
router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/comments', commentRoutes);
router.get('/trending', getTrending);
router.get('/search', searchPosts);

module.exports = router;
