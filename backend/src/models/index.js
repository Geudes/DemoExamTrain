const { sequelize } = require('../config/database');
const User = require('./User');
const TrainerProfile = require('./TrainerProfile');
const Specialization = require('./Specialization');
const TrainerSpecialization = require('./TrainerSpecialization');
const Booking = require('./Booking');
const RefreshToken = require('./RefreshToken');

module.exports = {
  sequelize,
  User,
  TrainerProfile,
  Specialization,
  TrainerSpecialization,
  Booking,
  RefreshToken,
};
