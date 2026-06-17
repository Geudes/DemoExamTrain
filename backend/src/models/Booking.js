const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');
const Apartment = require('./Apartment');

const BOOKING_STATUSES = ['pending', 'confirmed', 'rejected', 'cancelled'];

const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  tenantId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
    onDelete: 'CASCADE',
  },
  apartmentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'apartments', key: 'id' },
    onDelete: 'CASCADE',
  },
  checkIn: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  checkOut: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  guests: {
    type: DataTypes.INTEGER,
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
    validate: { isIn: [BOOKING_STATUSES] },
  },
}, {
  tableName: 'bookings',
  timestamps: true,
  underscored: true,
});

Booking.belongsTo(User, { foreignKey: 'tenantId', as: 'Tenant' });
Booking.belongsTo(Apartment, { foreignKey: 'apartmentId', as: 'Apartment' });
User.hasMany(Booking, { foreignKey: 'tenantId', as: 'TenantBookings' });
Apartment.hasMany(Booking, { foreignKey: 'apartmentId', as: 'Bookings' });

module.exports = Booking;
module.exports.BOOKING_STATUSES = BOOKING_STATUSES;
