const express = require('express');
const { login, logout, getProfile } = require('../controllers/authController');
const authenticateToken = require('../middleware/authenticateToken');
const validate = require('../middleware/validate');
const { loginSchema } = require('../validators/authSchemas');

const router = express.Router();

router.post('/login', validate(loginSchema), login);
router.post('/logout', logout);
router.get('/profile', authenticateToken, getProfile);

module.exports = router;
