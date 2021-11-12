const express = require('express');
const router = express.Router();
const controller = require('../controllers/chatController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/store', controller.store);

module.exports = router;