const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/store', controller.store);
router.get('/checkEmailExists/:email', controller.checkEmailExists);
router.get('/checkUniquePhone/:phone', controller.checkUniquePhone);
router.post('/tryAuth', controller.tryAuth);
router.get('/searchUsers/:userParams', authMiddleware, controller.searchUsers);
router.put('/sendContactInvite', authMiddleware, controller.sendAddContactInvite);
router.put('/cancelContactInvite', authMiddleware, controller.cancelAddContactInvite);
router.get('/getUserNotifications/:id', controller.getUserNotifications);

module.exports = router;