const { TrainerProfile, Specialization } = require('../models');

const CLIENT_LEVELS = ['beginner', 'advanced', 'professional', 'online'];

function parseClientLevels(value) {
  if (value == null) return null;
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    return value.split(',').map((item) => item.trim()).filter(Boolean);
  }
  return null;
}

function validateClientLevels(levels) {
  if (!Array.isArray(levels)) return false;
  return levels.every((level) => CLIENT_LEVELS.includes(level));
}

async function userToResponse(user) {
  const base = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };

  if (user.role !== 'trainer') {
    return base;
  }

  const profile = await TrainerProfile.findOne({ where: { userId: user.id } });
  const specializations = await user.getSpecializations({ attributes: ['id', 'name'] });

  return {
    ...base,
    about: profile?.about || null,
    photo: profile?.photo || null,
    price: profile?.price != null ? Number(profile.price) : null,
    rating: profile?.rating != null ? Number(profile.rating) : 0,
    contacts: profile?.contacts || null,
    clientLevels: profile?.clientLevels || [],
    specializations: specializations.map((item) => ({ id: item.id, name: item.name })),
  };
}

async function trainerToCard(user, profile, specializations) {
  const specs = specializations || [];
  return {
    id: user.id,
    name: user.name,
    photo: profile?.photo || null,
    price: profile?.price != null ? Number(profile.price) : null,
    rating: profile?.rating != null ? Number(profile.rating) : 0,
    specialization: specs[0]?.name || null,
    specializations: specs.map((item) => ({ id: item.id, name: item.name })),
    clientLevels: profile?.clientLevels || [],
    about: profile?.about || null,
    contacts: profile?.contacts || null,
  };
}

module.exports = {
  CLIENT_LEVELS,
  parseClientLevels,
  validateClientLevels,
  userToResponse,
  trainerToCard,
};
