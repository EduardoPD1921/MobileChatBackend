const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/store', controller.store);
router.get('/checkEmailExists/:email', controller.checkEmailExists);
router.get('/checkUniquePhone/:phone', controller.checkUniquePhone);
router.post('/tryAuth', controller.tryAuth);
router.get('/searchUsers', authMiddleware, controller.searchUsers);

module.exports = router;