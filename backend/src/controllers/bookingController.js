const { TableBooking, User } = require('../models');
const { Op } = require('sequelize');

// Создать бронирование
const createBooking = async (req, res) => {
  try {
    const {
      bookingDate,
      bookingTime,
      numberOfGuests,
      specialRequests,
      contactPhone,
      hall
    } = req.body;

    // Проверяем, что дата не в прошлом
    const bookingDateTime = new Date(`${bookingDate}T${bookingTime}`);
    if (bookingDateTime < new Date()) {
      return res.status(400).json({ error: 'Нельзя забронировать на прошедшее время' });
    }

    // Проверяем доступность времени (упрощенная версия)
    const existingBookings = await TableBooking.count({
      where: {
        bookingDate,
        bookingTime,
        status: ['pending', 'confirmed']
      }
    });

    // Предполагаем, что у нас есть 10 столиков
    if (existingBookings >= 10) {
      return res.status(400).json({ 
        error: 'На это время все столики заняты' 
      });
    }

    const booking = await TableBooking.create({
      userId: req.user.id,
      bookingDate,
      bookingTime,
      numberOfGuests,
      specialRequests,
      contactPhone,
      hall
    });

    res.status(201).json({
      message: 'Бронирование создано',
      booking
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при создании бронирования' });
  }
};

// Получить бронирования пользователя
const getUserBookings = async (req, res) => {
  try {
    const { status } = req.query;
    const where = { userId: req.user.id };
    if (status) where.status = status;

    const bookings = await TableBooking.findAll({
      where,
      order: [['bookingDate', 'DESC'], ['bookingTime', 'DESC']]
    });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении бронирований' });
  }
};

// Получить все бронирования (для staff/admin)
const getAllBookings = async (req, res) => {
  try {
    const { date, status } = req.query;
    const where = {};
    
    if (date) where.bookingDate = date;
    if (status) where.status = status;

    const bookings = await TableBooking.findAll({
      where,
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'firstName', 'lastName', 'email', 'phone']
      }],
      order: [['bookingDate', 'ASC'], ['bookingTime', 'ASC']]
    });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении бронирований' });
  }
};

// Получить одно бронирование
const getBooking = async (req, res) => {
  try {
    const booking = await TableBooking.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'firstName', 'lastName', 'email', 'phone']
      }]
    });

    if (!booking) {
      return res.status(404).json({ error: 'Бронирование не найдено' });
    }

    // Проверяем доступ
    if (req.user.role === 'client' && booking.userId !== req.user.id) {
      return res.status(403).json({ error: 'Доступ запрещен' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении бронирования' });
  }
};

// Обновить статус бронирования (для staff/admin)
const updateBookingStatus = async (req, res) => {
  try {
    const { status, tableNumber } = req.body;
    const booking = await TableBooking.findByPk(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: 'Бронирование не найдено' });
    }

    booking.status = status;
    if (tableNumber) booking.tableNumber = tableNumber;
    await booking.save();

    res.json({
      message: 'Статус бронирования обновлен',
      booking
    });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при обновлении бронирования' });
  }
};

// Отменить бронирование
const cancelBooking = async (req, res) => {
  try {
    const booking = await TableBooking.findByPk(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: 'Бронирование не найдено' });
    }

    // Проверяем права
    if (req.user.role === 'client' && booking.userId !== req.user.id) {
      return res.status(403).json({ error: 'Доступ запрещен' });
    }

    // Проверяем возможность отмены
    if (['cancelled', 'completed'].includes(booking.status)) {
      return res.status(400).json({ error: 'Невозможно отменить это бронирование' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({
      message: 'Бронирование отменено',
      booking
    });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при отмене бронирования' });
  }
};

// Получить доступные времена для бронирования
const getAvailableTimes = async (req, res) => {
  try {
    const { date } = req.query;
    
    if (!date) {
      return res.status(400).json({ error: 'Необходимо указать дату' });
    }

    // Время работы ресторана: 10:00 - 22:00
    const workingHours = [];
    for (let hour = 10; hour < 22; hour++) {
      workingHours.push(`${hour}:00`, `${hour}:30`);
    }

    // Получаем занятые времена
    const busyTimes = await TableBooking.findAll({
      where: {
        bookingDate: date,
        status: ['pending', 'confirmed']
      },
      attributes: ['bookingTime'],
      group: ['bookingTime'],
      having: sequelize.literal('COUNT(*) >= 10') // Если все 10 столиков заняты
    });

    const busyTimesArray = busyTimes.map(b => b.bookingTime);
    const availableTimes = workingHours.filter(time => !busyTimesArray.includes(time));

    res.json(availableTimes);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении доступного времени' });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getAllBookings,
  getBooking,
  updateBookingStatus,
  cancelBooking,
  getAvailableTimes
};
