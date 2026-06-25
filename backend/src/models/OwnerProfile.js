const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const OwnerProfile = sequelize.define('OwnerProfile', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: { model: 'users', key: 'id' },
    onDelete: 'CASCADE',
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'owner_profiles',
  timestamps: true,
  underscored: true,
});

OwnerProfile.belongsTo(User, { foreignKey: 'userId' });
User.hasOne(OwnerProfile, { foreignKey: 'userId' });

module.exports = OwnerProfile;
