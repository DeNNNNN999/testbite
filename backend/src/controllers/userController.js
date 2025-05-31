const { User, Order } = require('../models');
const { Op } = require('sequelize');

// Получить всех пользователей
const getUsers = async (req, res) => {
  try {
    const { role, search } = req.query;
    const where = {};
    
    if (role) where.role = role;
    if (search) {
      where[Op.or] = [
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const users = await User.findAll({
      where,
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении пользователей' });
  }
};

// Получить одного пользователя
const getUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
      include: [{
        model: Order,
        as: 'orders',
        limit: 5,
        order: [['createdAt', 'DESC']]
      }]
    });

    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении пользователя' });
  }
};

// Обновить роль пользователя
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    // Нельзя изменить роль самому себе
    if (user.id === req.user.id) {
      return res.status(400).json({ error: 'Нельзя изменить свою роль' });
    }

    user.role = role;
    await user.save();

    res.json({
      message: 'Роль пользователя обновлена',
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при обновлении роли' });
  }
};

// Активировать/деактивировать пользователя
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    // Нельзя деактивировать самого себя
    if (user.id === req.user.id) {
      return res.status(400).json({ error: 'Нельзя деактивировать свой аккаунт' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      message: `Пользователь ${user.isActive ? 'активирован' : 'деактивирован'}`,
      isActive: user.isActive
    });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при изменении статуса' });
  }
};

// Добавить бонусные баллы
const addBonusPoints = async (req, res) => {
  try {
    const { points } = req.body;
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    user.bonusPoints += points;
    await user.save();

    res.json({
      message: 'Бонусные баллы добавлены',
      bonusPoints: user.bonusPoints
    });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при добавлении баллов' });
  }
};

// Статистика по пользователям
const getUsersStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const usersByRole = await User.findAll({
      attributes: [
        'role',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['role']
    });

    const activeUsers = await User.count({ where: { isActive: true } });
    
    // Пользователи, сделавшие заказ за последние 30 дней
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const activeCustomers = await User.count({
      include: [{
        model: Order,
        as: 'orders',
        where: {
          createdAt: { [Op.gte]: thirtyDaysAgo }
        },
        required: true
      }],
      distinct: true
    });

    res.json({
      totalUsers,
      usersByRole,
      activeUsers,
      activeCustomers
    });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении статистики' });
  }
};

module.exports = {
  getUsers,
  getUser,
  updateUserRole,
  toggleUserStatus,
  addBonusPoints,
  getUsersStats
};
