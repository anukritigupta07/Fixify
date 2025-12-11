const express = require('express');
const { googleAuth } = require('../controllers/google.controller');
const router = express.Router();

router.post('/auth/google', googleAuth);

module.exports = router;
