const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

// Публичные маршруты
router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategoryWithItems);

// Маршруты только для админа
router.post('/', authMiddleware, roleMiddleware(['admin']), categoryController.createCategory);
router.put('/:id', authMiddleware, roleMiddleware(['admin']), categoryController.updateCategory);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), categoryController.deleteCategory);

module.exports = router;
