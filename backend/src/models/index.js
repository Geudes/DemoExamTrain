const { sequelize } = require('../config/database');
const User = require('./User');
const TeacherProfile = require('./TeacherProfile');
const Instrument = require('./Instrument');
const TeacherInstrument = require('./TeacherInstrument');
const Lesson = require('./Lesson');
const RefreshToken = require('./RefreshToken');

module.exports = {
  sequelize,
  User,
  TeacherProfile,
  Instrument,
  TeacherInstrument,
  Lesson,
  RefreshToken,
};
