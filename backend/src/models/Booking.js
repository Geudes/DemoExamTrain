const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  clientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
    onDelete: 'CASCADE',
  },
  trainerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
    onDelete: 'CASCADE',
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  time: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pending',
    validate: { isIn: [['pending', 'accepted', 'rejected', 'cancelled']] },
  },
}, {
  tableName: 'bookings',
  timestamps: true,
  underscored: true,
});

Booking.belongsTo(User, { foreignKey: 'clientId', as: 'Client' });
Booking.belongsTo(User, { foreignKey: 'trainerId', as: 'Trainer' });
User.hasMany(Booking, { foreignKey: 'clientId', as: 'ClientBookings' });
User.hasMany(Booking, { foreignKey: 'trainerId', as: 'TrainerBookings' });

module.exports = Booking;
