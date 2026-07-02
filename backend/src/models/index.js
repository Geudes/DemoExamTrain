const { sequelize } = require('../config/database');
const User = require('./User');
const DoctorProfile = require('./DoctorProfile');
const Specialization = require('./Specialization');
const DoctorSpecialization = require('./DoctorSpecialization');
const Appointment = require('./Appointment');
const RefreshToken = require('./RefreshToken');

module.exports = {
  sequelize,
  User,
  DoctorProfile,
  Specialization,
  DoctorSpecialization,
  Appointment,
  RefreshToken,
};
