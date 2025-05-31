const { Order, OrderItem, MenuItem, User, Category } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

// Статистика продаж за период
const getSalesStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const where = {
      status: 'delivered',
      createdAt: {}
    };

    if (startDate) {
      where.createdAt[Op.gte] = new Date(startDate);
    }
    if (endDate) {
      where.createdAt[Op.lte] = new Date(endDate);
    }

    // Общая статистика
    const totalOrders = await Order.count({ where });
    const totalRevenue = await Order.sum('totalAmount', { where });
    const averageOrderValue = totalRevenue / totalOrders || 0;

    // Статистика по дням
    const dailyStats = await Order.findAll({
      where,
      attributes: [
        [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'orders'],
        [sequelize.fn('SUM', sequelize.col('totalAmount')), 'revenue']
      ],
      group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
      order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'ASC']]
    });

    // Статистика по способам доставки
    const deliveryStats = await Order.findAll({
      where,
      attributes: [
        'deliveryType',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('totalAmount')), 'revenue']
      ],
      group: ['deliveryType']
    });

    res.json({
      summary: {
        totalOrders,
        totalRevenue,
        averageOrderValue
      },
      dailyStats,
      deliveryStats
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при получении статистики продаж' });
  }
};

// Популярные блюда
const getPopularItems = async (req, res) => {
  try {
    const { limit = 10, startDate, endDate } = req.query;
    
    const where = {};
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt[Op.gte] = new Date(startDate);
      if (endDate) where.createdAt[Op.lte] = new Date(endDate);
    }

    const popularItems = await OrderItem.findAll({
      attributes: [
        'menuItemId',
        [sequelize.fn('COUNT', sequelize.col('OrderItem.id')), 'orderCount'],
        [sequelize.fn('SUM', sequelize.col('quantity')), 'totalQuantity'],
        [sequelize.fn('SUM', sequelize.col('totalPrice')), 'totalRevenue']
      ],
      include: [
        {
          model: MenuItem,
          as: 'menuItem',
          attributes: ['name', 'price'],
          include: [{
            model: Category,
            as: 'category',
            attributes: ['name']
          }]
        },
        {
          model: Order,
          as: 'order',
          attributes: [],
          where: { ...where, status: 'delivered' }
        }
      ],
      group: ['menuItemId', 'menuItem.id', 'menuItem.category.id'],
      order: [[sequelize.fn('SUM', sequelize.col('quantity')), 'DESC']],
      limit: parseInt(limit)
    });

    res.json(popularItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при получении популярных блюд' });
  }
};

// Статистика по категориям
const getCategoryStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const where = {};
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt[Op.gte] = new Date(startDate);
      if (endDate) where.createdAt[Op.lte] = new Date(endDate);
    }

    const categoryStats = await Category.findAll({
      attributes: [
        'id',
        'name',
        [sequelize.fn('COUNT', sequelize.col('menuItems.orderItems.id')), 'orderCount'],
        [sequelize.fn('SUM', sequelize.col('menuItems.orderItems.quantity')), 'totalQuantity'],
        [sequelize.fn('SUM', sequelize.col('menuItems.orderItems.totalPrice')), 'totalRevenue']
      ],
      include: [{
        model: MenuItem,
        as: 'menuItems',
        attributes: [],
        include: [{
          model: OrderItem,
          as: 'orderItems',
          attributes: [],
          include: [{
            model: Order,
            as: 'order',
            attributes: [],
            where: { ...where, status: 'delivered' }
          }]
        }]
      }],
      group: ['Category.id'],
      order: [[sequelize.fn('SUM', sequelize.col('menuItems.orderItems.totalPrice')), 'DESC']]
    });

    res.json(categoryStats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при получении статистики по категориям' });
  }
};

// Статистика по клиентам
const getCustomerStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const where = {
      status: 'delivered'
    };
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt[Op.gte] = new Date(startDate);
      if (endDate) where.createdAt[Op.lte] = new Date(endDate);
    }

    // Топ клиентов
    const topCustomers = await User.findAll({
      attributes: [
        'id',
        'firstName',
        'lastName',
        'email',
        'bonusPoints',
        [sequelize.fn('COUNT', sequelize.col('orders.id')), 'orderCount'],
        [sequelize.fn('SUM', sequelize.col('orders.totalAmount')), 'totalSpent']
      ],
      include: [{
        model: Order,
        as: 'orders',
        attributes: [],
        where
      }],
      group: ['User.id'],
      order: [[sequelize.fn('SUM', sequelize.col('orders.totalAmount')), 'DESC']],
      limit: 10
    });

    // Новые клиенты за период
    const newCustomersWhere = {};
    if (startDate) newCustomersWhere.createdAt = { [Op.gte]: new Date(startDate) };
    if (endDate) newCustomersWhere.createdAt = { [Op.lte]: new Date(endDate) };
    
    const newCustomers = await User.count({
      where: { ...newCustomersWhere, role: 'client' }
    });

    res.json({
      topCustomers,
      newCustomers
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при получении статистики по клиентам' });
  }
};

// Статистика по времени заказов
const getOrderTimeStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const where = {
      status: 'delivered'
    };
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt[Op.gte] = new Date(startDate);
      if (endDate) where.createdAt[Op.lte] = new Date(endDate);
    }

    // Статистика по часам
    const hourlyStats = await Order.findAll({
      where,
      attributes: [
        [sequelize.fn('EXTRACT', sequelize.literal('HOUR FROM "createdAt"')), 'hour'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'orders'],
        [sequelize.fn('SUM', sequelize.col('totalAmount')), 'revenue']
      ],
      group: [sequelize.fn('EXTRACT', sequelize.literal('HOUR FROM "createdAt"'))],
      order: [[sequelize.fn('EXTRACT', sequelize.literal('HOUR FROM "createdAt"')), 'ASC']]
    });

    // Статистика по дням недели
    const weekdayStats = await Order.findAll({
      where,
      attributes: [
        [sequelize.fn('EXTRACT', sequelize.literal('DOW FROM "createdAt"')), 'dayOfWeek'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'orders'],
        [sequelize.fn('SUM', sequelize.col('totalAmount')), 'revenue']
      ],
      group: [sequelize.fn('EXTRACT', sequelize.literal('DOW FROM "createdAt"'))],
      order: [[sequelize.fn('EXTRACT', sequelize.literal('DOW FROM "createdAt"')), 'ASC']]
    });

    res.json({
      hourlyStats,
      weekdayStats
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при получении статистики по времени' });
  }
};

module.exports = {
  getSalesStats,
  getPopularItems,
  getCategoryStats,
  getCustomerStats,
  getOrderTimeStats
};
