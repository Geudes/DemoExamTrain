const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');
const Instrument = require('./Instrument');

const TeacherInstrument = sequelize.define('TeacherInstrument', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  teacherId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
    onDelete: 'CASCADE',
  },
  instrumentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'instruments', key: 'id' },
    onDelete: 'CASCADE',
  },
}, {
  tableName: 'teacher_instruments',
  timestamps: true,
  underscored: true,
  indexes: [
    { unique: true, fields: ['teacher_id', 'instrument_id'] },
  ],
});

TeacherInstrument.belongsTo(User, { foreignKey: 'teacherId', as: 'Teacher' });
TeacherInstrument.belongsTo(Instrument, { foreignKey: 'instrumentId' });
User.belongsToMany(Instrument, {
  through: TeacherInstrument,
  foreignKey: 'teacherId',
  otherKey: 'instrumentId',
  as: 'Instruments',
});
Instrument.belongsToMany(User, {
  through: TeacherInstrument,
  foreignKey: 'instrumentId',
  otherKey: 'teacherId',
  as: 'Teachers',
});

module.exports = TeacherInstrument;
