const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

// Все маршруты только для админа
router.use(authMiddleware, roleMiddleware(['admin']));

router.get('/', userController.getUsers);
router.get('/stats', userController.getUsersStats);
router.get('/:id', userController.getUser);
router.patch('/:id/role', userController.updateUserRole);
router.patch('/:id/status', userController.toggleUserStatus);
router.post('/:id/bonus-points', userController.addBonusPoints);

module.exports = router;
