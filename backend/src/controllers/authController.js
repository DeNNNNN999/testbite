const { User } = require('../models');
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone, role } = req.body;

    // Проверка существующего пользователя
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Пользователь с таким email уже существует' });
    }

    // Создание пользователя
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      phone,
      role: role || 'client'
    });

    const token = generateToken(user);

    res.status(201).json({
      message: 'Регистрация успешна',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при регистрации' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Поиск пользователя
    const user = await User.findOne({ where: { email } });
    if (!user || !await user.validatePassword(password)) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: 'Аккаунт деактивирован' });
    }

    const token = generateToken(user);

    res.json({
      message: 'Вход выполнен успешно',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        bonusPoints: user.bonusPoints
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при входе' });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении профиля' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone } = req.body;
    
    await req.user.update({
      firstName,
      lastName,
      phone
    });

    res.json({
      message: 'Профиль обновлен',
      user: {
        id: req.user.id,
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        phone: req.user.phone
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при обновлении профиля' });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile
};
