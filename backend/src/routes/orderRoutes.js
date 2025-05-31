const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

// Маршруты для всех авторизованных пользователей
router.get('/my', authMiddleware, orderController.getUserOrders);
router.post('/', authMiddleware, orderController.createOrder);
router.get('/:id', authMiddleware, orderController.getOrder);
router.post('/:id/cancel', authMiddleware, orderController.cancelOrder);

// Маршруты для персонала и админа
router.get('/', authMiddleware, roleMiddleware(['staff', 'admin']), orderController.getAllOrders);
router.patch('/:id/status', authMiddleware, roleMiddleware(['staff', 'admin']), orderController.updateOrderStatus);

module.exports = router;
