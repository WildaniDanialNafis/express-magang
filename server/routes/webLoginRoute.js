const express = require('express');
const router = express.Router();
const { webloginValidator, validateWebLogin } = require('../validators/webLoginValidator');
const { getUser } = require('../controllers/webLoginController');

router.post('/login', webloginValidator, validateWebLogin, getUser);

module.exports = router;