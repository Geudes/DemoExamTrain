const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');
const Specialization = require('./Specialization');

const DoctorSpecialization = sequelize.define('DoctorSpecialization', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  doctorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
    onDelete: 'CASCADE',
  },
  specializationId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'specializations', key: 'id' },
    onDelete: 'CASCADE',
  },
}, {
  tableName: 'doctor_specializations',
  timestamps: true,
  underscored: true,
  indexes: [
    { unique: true, fields: ['doctor_id', 'specialization_id'] },
  ],
});

DoctorSpecialization.belongsTo(User, { foreignKey: 'doctorId', as: 'Doctor' });
DoctorSpecialization.belongsTo(Specialization, { foreignKey: 'specializationId' });
User.belongsToMany(Specialization, {
  through: DoctorSpecialization,
  foreignKey: 'doctorId',
  otherKey: 'specializationId',
  as: 'Specializations',
});
Specialization.belongsToMany(User, {
  through: DoctorSpecialization,
  foreignKey: 'specializationId',
  otherKey: 'doctorId',
  as: 'Doctors',
});

module.exports = DoctorSpecialization;
