const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  orderNumber: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('new', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'),
    defaultValue: 'new'
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  deliveryType: {
    type: DataTypes.ENUM('delivery', 'pickup'),
    allowNull: false
  },
  deliveryAddress: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  deliveryTime: {
    type: DataTypes.DATE,
    allowNull: true
  },
  paymentMethod: {
    type: DataTypes.ENUM('cash', 'card', 'online'),
    defaultValue: 'cash'
  },
  isPaid: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  bonusPointsUsed: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
});

module.exports = Order;
