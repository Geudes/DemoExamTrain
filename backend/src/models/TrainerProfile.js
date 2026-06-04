const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const TrainerProfile = sequelize.define('TrainerProfile', {
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
  about: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  photo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  rating: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  contacts: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  clientLevels: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
  },
}, {
  tableName: 'trainer_profiles',
  timestamps: true,
  underscored: true,
});

TrainerProfile.belongsTo(User, { foreignKey: 'userId' });
User.hasOne(TrainerProfile, { foreignKey: 'userId' });

module.exports = TrainerProfile;
