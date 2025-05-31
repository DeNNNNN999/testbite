const { MenuItem, Category } = require('../models');
const { Op } = require('sequelize');

// Получить все блюда с фильтрацией
const getMenuItems = async (req, res) => {
  try {
    const { categoryId, available, search } = req.query;
    
    const where = {};
    if (categoryId) where.categoryId = categoryId;
    if (available !== undefined) where.isAvailable = available === 'true';
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const menuItems = await MenuItem.findAll({
      where,
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name']
      }],
      order: [['name', 'ASC']]
    });

    res.json(menuItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при получении меню' });
  }
};

// Получить одно блюдо
const getMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByPk(req.params.id, {
      include: [{
        model: Category,
        as: 'category'
      }]
    });

    if (!menuItem) {
      return res.status(404).json({ error: 'Блюдо не найдено' });
    }

    res.json(menuItem);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении блюда' });
  }
};

// Создать блюдо (только для staff/admin)
const createMenuItem = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      categoryId,
      preparationTime,
      calories,
      weight,
      image
    } = req.body;

    const menuItem = await MenuItem.create({
      name,
      description,
      price,
      categoryId,
      preparationTime,
      calories,
      weight,
      image
    });

    const createdItem = await MenuItem.findByPk(menuItem.id, {
      include: [{
        model: Category,
        as: 'category'
      }]
    });

    res.status(201).json({
      message: 'Блюдо создано',
      menuItem: createdItem
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при создании блюда' });
  }
};

// Обновить блюдо (только для staff/admin)
const updateMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByPk(req.params.id);
    
    if (!menuItem) {
      return res.status(404).json({ error: 'Блюдо не найдено' });
    }

    await menuItem.update(req.body);

    const updatedItem = await MenuItem.findByPk(menuItem.id, {
      include: [{
        model: Category,
        as: 'category'
      }]
    });

    res.json({
      message: 'Блюдо обновлено',
      menuItem: updatedItem
    });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при обновлении блюда' });
  }
};

// Удалить блюдо (только для admin)
const deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByPk(req.params.id);
    
    if (!menuItem) {
      return res.status(404).json({ error: 'Блюдо не найдено' });
    }

    await menuItem.destroy();
    res.json({ message: 'Блюдо удалено' });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при удалении блюда' });
  }
};

// Изменить доступность блюда (для staff/admin)
const toggleAvailability = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByPk(req.params.id);
    
    if (!menuItem) {
      return res.status(404).json({ error: 'Блюдо не найдено' });
    }

    menuItem.isAvailable = !menuItem.isAvailable;
    await menuItem.save();

    res.json({
      message: `Блюдо ${menuItem.isAvailable ? 'доступно' : 'недоступно'}`,
      isAvailable: menuItem.isAvailable
    });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при изменении доступности' });
  }
};

module.exports = {
  getMenuItems,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleAvailability
};
