const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const APPOINTMENT_STATUSES = ['pending', 'confirmed', 'rejected', 'cancelled'];
const VISIT_FORMATS = ['in_person', 'online'];

const Appointment = sequelize.define('Appointment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  patientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
    onDelete: 'CASCADE',
  },
  doctorId: {
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
  format: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { isIn: [VISIT_FORMATS] },
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pending',
    validate: { isIn: [APPOINTMENT_STATUSES] },
  },
}, {
  tableName: 'appointments',
  timestamps: true,
  underscored: true,
});

Appointment.belongsTo(User, { foreignKey: 'patientId', as: 'Patient' });
Appointment.belongsTo(User, { foreignKey: 'doctorId', as: 'Doctor' });
User.hasMany(Appointment, { foreignKey: 'patientId', as: 'PatientAppointments' });
User.hasMany(Appointment, { foreignKey: 'doctorId', as: 'DoctorAppointments' });

module.exports = Appointment;
module.exports.APPOINTMENT_STATUSES = APPOINTMENT_STATUSES;
module.exports.VISIT_FORMATS = VISIT_FORMATS;
