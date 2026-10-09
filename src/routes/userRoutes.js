const express = require('express');
const { listUsers, getUser, createUser } = require('../controllers/userController');
const validate = require('../middleware/validate');
const { registerSchema } = require('../validators/authSchemas');

const router = express.Router();

router.get('/', listUsers);
router.get('/:id', getUser);
router.post('/', validate(registerSchema), createUser);

module.exports = router;
