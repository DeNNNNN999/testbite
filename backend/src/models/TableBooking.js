const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TableBooking = sequelize.define('TableBooking', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  bookingDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  bookingTime: {
    type: DataTypes.TIME,
    allowNull: false
  },
  numberOfGuests: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  tableNumber: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'completed'),
    defaultValue: 'pending'
  },
  specialRequests: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  contactPhone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  hall: {
    type: DataTypes.STRING,
    defaultValue: 'main'
  }
});

module.exports = TableBooking;
