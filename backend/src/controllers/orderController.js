const { Order, OrderItem, MenuItem, User } = require('../models');
const { Op } = require('sequelize');

// Генерация номера заказа
const generateOrderNumber = () => {
  const date = new Date();
  const year = date.getFullYear().toString().substr(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${year}${month}${day}-${random}`;
};

// Создать заказ
const createOrder = async (req, res) => {
  const transaction = await Order.sequelize.transaction();
  
  try {
    const {
      items,
      deliveryType,
      deliveryAddress,
      deliveryTime,
      paymentMethod,
      notes,
      bonusPointsUsed
    } = req.body;

    // Валидация items
    if (!items || items.length === 0) {
      throw new Error('Корзина пуста');
    }

    // Проверяем доступность всех блюд
    const menuItemIds = items.map(item => item.menuItemId);
    const menuItems = await MenuItem.findAll({
      where: {
        id: menuItemIds,
        isAvailable: true
      }
    });

    if (menuItems.length !== items.length) {
      throw new Error('Некоторые блюда недоступны');
    }

    // Считаем общую сумму
    let totalAmount = 0;
    const orderItems = items.map(item => {
      const menuItem = menuItems.find(mi => mi.id === item.menuItemId);
      const itemTotal = menuItem.price * item.quantity;
      totalAmount += itemTotal;
      
      return {
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        price: menuItem.price,
        totalPrice: itemTotal,
        notes: item.notes
      };
    });

    // Применяем бонусные баллы
    const user = await User.findByPk(req.user.id);
    if (bonusPointsUsed > 0) {
      if (bonusPointsUsed > user.bonusPoints) {
        throw new Error('Недостаточно бонусных баллов');
      }
      totalAmount -= bonusPointsUsed / 10; // 10 баллов = 1 рубль
      if (totalAmount < 0) totalAmount = 0;
    }

    // Создаем заказ
    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      userId: req.user.id,
      totalAmount,
      deliveryType,
      deliveryAddress,
      deliveryTime,
      paymentMethod,
      notes,
      bonusPointsUsed
    }, { transaction });

    // Создаем элементы заказа
    await OrderItem.bulkCreate(
      orderItems.map(item => ({ ...item, orderId: order.id })),
      { transaction }
    );

    // Обновляем бонусные баллы пользователя
    if (bonusPointsUsed > 0) {
      user.bonusPoints -= bonusPointsUsed;
    }
    // Начисляем новые бонусные баллы (5% от суммы)
    user.bonusPoints += Math.floor(totalAmount * 0.05);
    await user.save({ transaction });

    await transaction.commit();

    // Получаем заказ с деталями
    const createdOrder = await Order.findByPk(order.id, {
      include: [{
        model: OrderItem,
        as: 'items',
        include: [{
          model: MenuItem,
          as: 'menuItem',
          attributes: ['name', 'price', 'image']
        }]
      }]
    });

    res.status(201).json({
      message: 'Заказ создан',
      order: createdOrder
    });
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    res.status(400).json({ error: error.message || 'Ошибка при создании заказа' });
  }
};

// Получить заказы пользователя
const getUserOrders = async (req, res) => {
  try {
    const { status } = req.query;
    const where = { userId: req.user.id };
    if (status) where.status = status;

    const orders = await Order.findAll({
      where,
      include: [{
        model: OrderItem,
        as: 'items',
        include: [{
          model: MenuItem,
          as: 'menuItem',
          attributes: ['name', 'price', 'image']
        }]
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении заказов' });
  }
};

// Получить все заказы (для staff/admin)
const getAllOrders = async (req, res) => {
  try {
    const { status, date, userId } = req.query;
    const where = {};
    
    if (status) where.status = status;
    if (userId) where.userId = userId;
    if (date) {
      where.createdAt = {
        [Op.gte]: new Date(date),
        [Op.lt]: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000)
      };
    }

    const orders = await Order.findAll({
      where,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone']
        },
        {
          model: OrderItem,
          as: 'items',
          include: [{
            model: MenuItem,
            as: 'menuItem',
            attributes: ['name', 'price']
          }]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при получении заказов' });
  }
};

// Получить один заказ
const getOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone']
        },
        {
          model: OrderItem,
          as: 'items',
          include: [{
            model: MenuItem,
            as: 'menuItem'
          }]
        }
      ]
    });

    if (!order) {
      return res.status(404).json({ error: 'Заказ не найден' });
    }

    // Проверяем доступ
    if (req.user.role === 'client' && order.userId !== req.user.id) {
      return res.status(403).json({ error: 'Доступ запрещен' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении заказа' });
  }
};

// Обновить статус заказа (для staff/admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'Заказ не найден' });
    }

    // Валидация перехода статусов
    const statusFlow = {
      'new': ['confirmed', 'cancelled'],
      'confirmed': ['preparing', 'cancelled'],
      'preparing': ['ready', 'cancelled'],
      'ready': ['delivered', 'cancelled'],
      'delivered': [],
      'cancelled': []
    };

    if (!statusFlow[order.status].includes(status)) {
      return res.status(400).json({ 
        error: `Невозможно изменить статус с ${order.status} на ${status}` 
      });
    }

    order.status = status;
    if (status === 'delivered') {
      order.isPaid = true;
    }
    await order.save();

    res.json({
      message: 'Статус заказа обновлен',
      order
    });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при обновлении статуса' });
  }
};

// Отменить заказ
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'Заказ не найден' });
    }

    // Проверяем права
    if (req.user.role === 'client' && order.userId !== req.user.id) {
      return res.status(403).json({ error: 'Доступ запрещен' });
    }

    // Проверяем возможность отмены
    if (['delivered', 'cancelled'].includes(order.status)) {
      return res.status(400).json({ error: 'Невозможно отменить этот заказ' });
    }

    // Возвращаем бонусные баллы
    if (order.bonusPointsUsed > 0) {
      const user = await User.findByPk(order.userId);
      user.bonusPoints += order.bonusPointsUsed;
      await user.save();
    }

    order.status = 'cancelled';
    await order.save();

    res.json({
      message: 'Заказ отменен',
      order
    });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при отмене заказа' });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getAllOrders,
  getOrder,
  updateOrderStatus,
  cancelOrder
};
