const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');
const Specialization = require('./Specialization');

const TrainerSpecialization = sequelize.define('TrainerSpecialization', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  trainerId: {
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
  tableName: 'trainer_specializations',
  timestamps: true,
  underscored: true,
  indexes: [
    { unique: true, fields: ['trainer_id', 'specialization_id'] },
  ],
});

TrainerSpecialization.belongsTo(User, { foreignKey: 'trainerId', as: 'Trainer' });
TrainerSpecialization.belongsTo(Specialization, { foreignKey: 'specializationId' });
User.belongsToMany(Specialization, {
  through: TrainerSpecialization,
  foreignKey: 'trainerId',
  otherKey: 'specializationId',
  as: 'Specializations',
});
Specialization.belongsToMany(User, {
  through: TrainerSpecialization,
  foreignKey: 'specializationId',
  otherKey: 'trainerId',
  as: 'Trainers',
});

module.exports = TrainerSpecialization;
