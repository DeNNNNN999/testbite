const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

// Все маршруты только для админа
router.use(authMiddleware, roleMiddleware(['admin']));

router.get('/sales', statsController.getSalesStats);
router.get('/popular-items', statsController.getPopularItems);
router.get('/categories', statsController.getCategoryStats);
router.get('/customers', statsController.getCustomerStats);
router.get('/order-times', statsController.getOrderTimeStats);

module.exports = router;
