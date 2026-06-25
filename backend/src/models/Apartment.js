const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const APARTMENT_TYPES = ['apartment', 'studio', 'house', 'room'];

const Apartment = sequelize.define('Apartment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  ownerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
    onDelete: 'CASCADE',
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { isIn: [APARTMENT_TYPES] },
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  shortDescription: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  pricePerNight: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  rooms: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  maxGuests: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  amenities: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
  },
  photos: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
  },
  published: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    allowNull: false,
    defaultValue: 0,
  },
}, {
  tableName: 'apartments',
  timestamps: true,
  underscored: true,
});

Apartment.belongsTo(User, { foreignKey: 'ownerId', as: 'Owner' });
User.hasMany(Apartment, { foreignKey: 'ownerId', as: 'Apartments' });

module.exports = Apartment;
module.exports.APARTMENT_TYPES = APARTMENT_TYPES;
