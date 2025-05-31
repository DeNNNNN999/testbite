const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

// Публичные маршруты
router.get('/', menuController.getMenuItems);
router.get('/:id', menuController.getMenuItem);

// Маршруты для персонала и админа
router.post('/', authMiddleware, roleMiddleware(['staff', 'admin']), menuController.createMenuItem);
router.put('/:id', authMiddleware, roleMiddleware(['staff', 'admin']), menuController.updateMenuItem);
router.patch('/:id/availability', authMiddleware, roleMiddleware(['staff', 'admin']), menuController.toggleAvailability);

// Маршруты только для админа
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), menuController.deleteMenuItem);

module.exports = router;
