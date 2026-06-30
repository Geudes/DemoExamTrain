const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const DoctorProfile = sequelize.define('DoctorProfile', {
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
  visitFormats: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
  },
}, {
  tableName: 'doctor_profiles',
  timestamps: true,
  underscored: true,
});

DoctorProfile.belongsTo(User, { foreignKey: 'userId' });
User.hasOne(DoctorProfile, { foreignKey: 'userId' });

module.exports = DoctorProfile;
