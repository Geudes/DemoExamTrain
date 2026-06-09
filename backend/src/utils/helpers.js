const { TeacherProfile } = require('../models');

const STUDENT_LEVELS = ['beginner', 'advanced', 'professional', 'online'];

function parseStudentLevels(value) {
  if (value == null) return null;
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    return value.split(',').map((item) => item.trim()).filter(Boolean);
  }
  return null;
}

function validateStudentLevels(levels) {
  if (!Array.isArray(levels)) return false;
  return levels.every((level) => STUDENT_LEVELS.includes(level));
}

async function userToResponse(user) {
  const base = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };

  if (user.role !== 'teacher') {
    return base;
  }

  const profile = await TeacherProfile.findOne({ where: { userId: user.id } });
  const instruments = await user.getInstruments({ attributes: ['id', 'name'] });

  return {
    ...base,
    about: profile?.about || null,
    photo: profile?.photo || null,
    price: profile?.price != null ? Number(profile.price) : null,
    rating: profile?.rating != null ? Number(profile.rating) : 0,
    contacts: profile?.contacts || null,
    studentLevels: profile?.studentLevels || [],
    instruments: instruments.map((item) => ({ id: item.id, name: item.name })),
  };
}

async function teacherToCard(user, profile, instruments) {
  const items = instruments || [];
  return {
    id: user.id,
    name: user.name,
    photo: profile?.photo || null,
    price: profile?.price != null ? Number(profile.price) : null,
    rating: profile?.rating != null ? Number(profile.rating) : 0,
    instrument: items[0]?.name || null,
    instruments: items.map((item) => ({ id: item.id, name: item.name })),
    studentLevels: profile?.studentLevels || [],
    about: profile?.about || null,
    contacts: profile?.contacts || null,
  };
}

module.exports = {
  STUDENT_LEVELS,
  parseStudentLevels,
  validateStudentLevels,
  userToResponse,
  teacherToCard,
};
