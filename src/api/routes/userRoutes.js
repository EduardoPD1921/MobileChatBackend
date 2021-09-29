const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');

router.post('/store', controller.store);

module.exports = router;