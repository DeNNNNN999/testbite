const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

// Маршруты для всех авторизованных пользователей
router.get('/my', authMiddleware, bookingController.getUserBookings);
router.post('/', authMiddleware, bookingController.createBooking);
router.get('/available-times', authMiddleware, bookingController.getAvailableTimes);
router.get('/:id', authMiddleware, bookingController.getBooking);
router.post('/:id/cancel', authMiddleware, bookingController.cancelBooking);

// Маршруты для персонала и админа
router.get('/', authMiddleware, roleMiddleware(['staff', 'admin']), bookingController.getAllBookings);
router.patch('/:id/status', authMiddleware, roleMiddleware(['staff', 'admin']), bookingController.updateBookingStatus);

module.exports = router;
