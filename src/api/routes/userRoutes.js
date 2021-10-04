const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');

router.post('/store', controller.store);
router.get('/checkEmailExists/:email', controller.checkEmailExists);
router.get('/checkUniquePhone/:phone', controller.checkUniquePhone);
router.post('/tryAuth', controller.tryAuth);

module.exports = router;