const { DoctorProfile } = require('../models');

const VISIT_FORMATS = ['in_person', 'online'];

function parseVisitFormats(value) {
  if (value == null) return null;
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    return value.split(',').map((item) => item.trim()).filter(Boolean);
  }
  return null;
}

function validateVisitFormats(formats) {
  if (!Array.isArray(formats)) return false;
  return formats.every((format) => VISIT_FORMATS.includes(format));
}

async function userToResponse(user) {
  const base = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };

  if (user.role !== 'doctor') {
    return base;
  }

  const profile = await DoctorProfile.findOne({ where: { userId: user.id } });
  const specializations = await user.getSpecializations({ attributes: ['id', 'name'] });

  return {
    ...base,
    about: profile?.about || null,
    photo: profile?.photo || null,
    price: profile?.price != null ? Number(profile.price) : null,
    rating: profile?.rating != null ? Number(profile.rating) : 0,
    contacts: profile?.contacts || null,
    visitFormats: profile?.visitFormats || [],
    specializations: specializations.map((item) => ({ id: item.id, name: item.name })),
  };
}

function doctorToCard(user, profile, specializations) {
  const specs = specializations || [];
  return {
    id: user.id,
    name: user.name,
    photo: profile?.photo || null,
    price: profile?.price != null ? Number(profile.price) : null,
    rating: profile?.rating != null ? Number(profile.rating) : 0,
    specialization: specs[0]?.name || null,
    specializations: specs.map((item) => ({ id: item.id, name: item.name })),
    visitFormats: profile?.visitFormats || [],
    about: profile?.about || null,
    contacts: profile?.contacts || null,
  };
}

module.exports = {
  VISIT_FORMATS,
  parseVisitFormats,
  validateVisitFormats,
  userToResponse,
  doctorToCard,
};
