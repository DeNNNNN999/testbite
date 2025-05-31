const { Category, MenuItem } = require('../models');

// Получить все категории
const getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: { isActive: true },
      order: [['displayOrder', 'ASC'], ['name', 'ASC']]
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении категорий' });
  }
};

// Получить категорию с блюдами
const getCategoryWithItems = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: [{
        model: MenuItem,
        as: 'menuItems',
        where: { isAvailable: true },
        required: false
      }]
    });

    if (!category) {
      return res.status(404).json({ error: 'Категория не найдена' });
    }

    res.json(category);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении категории' });
  }
};

// Создать категорию (только admin)
const createCategory = async (req, res) => {
  try {
    const { name, description, displayOrder } = req.body;
    
    const category = await Category.create({
      name,
      description,
      displayOrder
    });

    res.status(201).json({
      message: 'Категория создана',
      category
    });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при создании категории' });
  }
};

// Обновить категорию (только admin)
const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    
    if (!category) {
      return res.status(404).json({ error: 'Категория не найдена' });
    }

    await category.update(req.body);
    res.json({
      message: 'Категория обновлена',
      category
    });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при обновлении категории' });
  }
};

// Удалить категорию (только admin)
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    
    if (!category) {
      return res.status(404).json({ error: 'Категория не найдена' });
    }

    // Проверяем, есть ли блюда в категории
    const itemsCount = await MenuItem.count({ where: { categoryId: category.id } });
    if (itemsCount > 0) {
      return res.status(400).json({ 
        error: 'Невозможно удалить категорию с блюдами' 
      });
    }

    await category.destroy();
    res.json({ message: 'Категория удалена' });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при удалении категории' });
  }
};

module.exports = {
  getCategories,
  getCategoryWithItems,
  createCategory,
  updateCategory,
  deleteCategory
};
