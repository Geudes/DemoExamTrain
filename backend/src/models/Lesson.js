const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const Lesson = sequelize.define('Lesson', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
    onDelete: 'CASCADE',
  },
  teacherId: {
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
  comment: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pending',
    validate: { isIn: [['pending', 'accepted', 'rejected', 'cancelled']] },
  },
}, {
  tableName: 'lessons',
  timestamps: true,
  underscored: true,
});

Lesson.belongsTo(User, { foreignKey: 'studentId', as: 'Student' });
Lesson.belongsTo(User, { foreignKey: 'teacherId', as: 'Teacher' });
User.hasMany(Lesson, { foreignKey: 'studentId', as: 'StudentLessons' });
User.hasMany(Lesson, { foreignKey: 'teacherId', as: 'TeacherLessons' });

module.exports = Lesson;
