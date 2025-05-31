require('dotenv').config({ path: '../../.env' });
const { sequelize, User, Category, MenuItem } = require('../models');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
  try {
    // Синхронизация БД (пересоздание таблиц)
    await sequelize.sync({ force: true });
    console.log('✅ База данных синхронизирована');

    // Создание пользователей
    const users = await User.bulkCreate([
      {
        email: 'admin@tastebite.com',
        password: 'admin123',
        firstName: 'Админ',
        lastName: 'Администратор',
        phone: '+7 900 000-00-00',
        role: 'admin',
        bonusPoints: 0
      },
      {
        email: 'staff@tastebite.com',
        password: 'staff123',
        firstName: 'Иван',
        lastName: 'Иванов',
        phone: '+7 900 111-11-11',
        role: 'staff',
        bonusPoints: 0
      },
      {
        email: 'client@tastebite.com',
        password: 'client123',
        firstName: 'Петр',
        lastName: 'Петров',
        phone: '+7 900 222-22-22',
        role: 'client',
        bonusPoints: 150
      }
    ], { individualHooks: true });
    console.log('✅ Пользователи созданы');

    // Создание категорий
    const categories = await Category.bulkCreate([
      { name: 'Завтраки', description: 'Блюда для начала дня', displayOrder: 1 },
      { name: 'Супы', description: 'Первые блюда', displayOrder: 2 },
      { name: 'Горячие блюда', description: 'Основные блюда', displayOrder: 3 },
      { name: 'Салаты', description: 'Свежие салаты', displayOrder: 4 },
      { name: 'Десерты', description: 'Сладкие блюда', displayOrder: 5 },
      { name: 'Напитки', description: 'Горячие и холодные напитки', displayOrder: 6 }
    ]);
    console.log('✅ Категории созданы');

    // Создание блюд
    const menuItems = await MenuItem.bulkCreate([
      // Завтраки
      {
        name: 'Английский завтрак',
        description: 'Яичница, бекон, сосиски, фасоль, тосты',
        price: 450,
        categoryId: categories[0].id,
        preparationTime: 15,
        calories: 650,
        weight: '350г'
      },
      {
        name: 'Овсяная каша с ягодами',
        description: 'Овсянка на молоке с клубникой и черникой',
        price: 250,
        categoryId: categories[0].id,
        preparationTime: 10,
        calories: 320,
        weight: '300г'
      },
      {
        name: 'Блинчики с творогом',
        description: 'Тонкие блинчики с нежным творожным кремом',
        price: 280,
        categoryId: categories[0].id,
        preparationTime: 12,
        calories: 380,
        weight: '250г'
      },
      
      // Супы
      {
        name: 'Борщ украинский',
        description: 'Традиционный борщ с говядиной и сметаной',
        price: 320,
        categoryId: categories[1].id,
        preparationTime: 20,
        calories: 280,
        weight: '350мл'
      },
      {
        name: 'Крем-суп из грибов',
        description: 'Нежный суп из шампиньонов со сливками',
        price: 350,
        categoryId: categories[1].id,
        preparationTime: 15,
        calories: 240,
        weight: '300мл'
      },
      {
        name: 'Солянка мясная',
        description: 'Сытный суп с копченостями и оливками',
        price: 380,
        categoryId: categories[1].id,
        preparationTime: 18,
        calories: 320,
        weight: '350мл'
      },
      
      // Горячие блюда
      {
        name: 'Стейк из говядины',
        description: 'Мраморная говядина с овощами гриль',
        price: 1200,
        categoryId: categories[2].id,
        preparationTime: 25,
        calories: 580,
        weight: '250г'
      },
      {
        name: 'Лосось на гриле',
        description: 'Филе лосося с лимонным соусом',
        price: 890,
        categoryId: categories[2].id,
        preparationTime: 20,
        calories: 420,
        weight: '200г'
      },
      {
        name: 'Паста Карбонара',
        description: 'Спагетти с беконом в сливочном соусе',
        price: 480,
        categoryId: categories[2].id,
        preparationTime: 15,
        calories: 520,
        weight: '300г'
      },
      {
        name: 'Куриная грудка с картофелем',
        description: 'Нежная курица с картофельным пюре',
        price: 520,
        categoryId: categories[2].id,
        preparationTime: 20,
        calories: 460,
        weight: '350г'
      },
      
      // Салаты
      {
        name: 'Цезарь с курицей',
        description: 'Классический салат с курицей и пармезаном',
        price: 420,
        categoryId: categories[3].id,
        preparationTime: 10,
        calories: 380,
        weight: '250г'
      },
      {
        name: 'Греческий салат',
        description: 'Свежие овощи с сыром фета и оливками',
        price: 380,
        categoryId: categories[3].id,
        preparationTime: 8,
        calories: 280,
        weight: '300г'
      },
      {
        name: 'Салат с тунцом',
        description: 'Микс салатов с тунцом и авокадо',
        price: 460,
        categoryId: categories[3].id,
        preparationTime: 10,
        calories: 320,
        weight: '280г'
      },
      
      // Десерты
      {
        name: 'Тирамису',
        description: 'Итальянский десерт с маскарпоне',
        price: 350,
        categoryId: categories[4].id,
        preparationTime: 5,
        calories: 420,
        weight: '150г'
      },
      {
        name: 'Чизкейк Нью-Йорк',
        description: 'Классический чизкейк с ягодным соусом',
        price: 380,
        categoryId: categories[4].id,
        preparationTime: 5,
        calories: 480,
        weight: '180г'
      },
      {
        name: 'Шоколадный фондан',
        description: 'Горячий шоколадный десерт с жидким центром',
        price: 420,
        categoryId: categories[4].id,
        preparationTime: 12,
        calories: 520,
        weight: '200г'
      },
      
      // Напитки
      {
        name: 'Американо',
        description: 'Классический черный кофе',
        price: 180,
        categoryId: categories[5].id,
        preparationTime: 3,
        calories: 5,
        weight: '200мл'
      },
      {
        name: 'Капучино',
        description: 'Эспрессо с молочной пенкой',
        price: 220,
        categoryId: categories[5].id,
        preparationTime: 5,
        calories: 120,
        weight: '250мл'
      },
      {
        name: 'Свежевыжатый апельсиновый сок',
        description: '100% натуральный сок',
        price: 280,
        categoryId: categories[5].id,
        preparationTime: 5,
        calories: 180,
        weight: '300мл'
      },
      {
        name: 'Лимонад домашний',
        description: 'Освежающий напиток с мятой',
        price: 250,
        categoryId: categories[5].id,
        preparationTime: 3,
        calories: 120,
        weight: '400мл'
      }
    ]);
    console.log('✅ Блюда созданы');

    console.log('\n✅ База данных успешно заполнена!');
    console.log('\n📧 Тестовые аккаунты:');
    console.log('Администратор: admin@tastebite.com / admin123');
    console.log('Сотрудник: staff@tastebite.com / staff123');
    console.log('Клиент: client@tastebite.com / client123');

  } catch (error) {
    console.error('❌ Ошибка при заполнении БД:', error);
  } finally {
    await sequelize.close();
  }
};

seedDatabase();
