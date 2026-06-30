const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Specialization = sequelize.define('Specialization', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
}, {
  tableName: 'specializations',
  timestamps: true,
  underscored: true,
});

module.exports = Specialization;
