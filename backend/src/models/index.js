const { sequelize } = require('../config/database');
const User = require('./User');
const OwnerProfile = require('./OwnerProfile');
const Apartment = require('./Apartment');
const Booking = require('./Booking');
const RefreshToken = require('./RefreshToken');

module.exports = {
  sequelize,
  User,
  OwnerProfile,
  Apartment,
  Booking,
  RefreshToken,
};
