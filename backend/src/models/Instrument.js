const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Instrument = sequelize.define('Instrument', {
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
  tableName: 'instruments',
  timestamps: true,
  underscored: true,
});

module.exports = Instrument;
