const { OwnerProfile } = require('../models');

function parseJsonArray(value) {
  if (value == null) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return value.split(',').map((item) => item.trim()).filter(Boolean);
    }
  }
  return [];
}

async function userToResponse(user) {
  const base = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };

  if (user.role !== 'owner') {
    return base;
  }

  const profile = await OwnerProfile.findOne({ where: { userId: user.id } });

  return {
    ...base,
    phone: profile?.phone || null,
    description: profile?.description || null,
    avatar: profile?.avatar || null,
  };
}

function apartmentToCard(apartment) {
  const photos = parseJsonArray(apartment.photos);
  return {
    id: apartment.id,
    title: apartment.title,
    city: apartment.city,
    type: apartment.type,
    pricePerNight: apartment.pricePerNight != null ? Number(apartment.pricePerNight) : null,
    rating: apartment.rating != null ? Number(apartment.rating) : 0,
    shortDescription: apartment.shortDescription || apartment.description?.slice(0, 120) || null,
    photo: photos[0] || null,
    photos,
    rooms: apartment.rooms,
    maxGuests: apartment.maxGuests,
    published: apartment.published,
  };
}

function apartmentToDetail(apartment, owner) {
  const photos = parseJsonArray(apartment.photos);
  const amenities = parseJsonArray(apartment.amenities);

  return {
    id: apartment.id,
    title: apartment.title,
    type: apartment.type,
    city: apartment.city,
    address: apartment.address,
    description: apartment.description,
    pricePerNight: apartment.pricePerNight != null ? Number(apartment.pricePerNight) : null,
    rooms: apartment.rooms,
    maxGuests: apartment.maxGuests,
    amenities,
    photos,
    published: apartment.published,
    rating: apartment.rating != null ? Number(apartment.rating) : 0,
    owner: owner ? {
      id: owner.id,
      name: owner.name,
      email: owner.email,
      phone: owner.OwnerProfile?.phone || null,
      description: owner.OwnerProfile?.description || null,
      avatar: owner.OwnerProfile?.avatar || null,
    } : null,
    ownerId: apartment.ownerId,
    createdAt: apartment.createdAt,
    updatedAt: apartment.updatedAt,
  };
}

module.exports = {
  parseJsonArray,
  userToResponse,
  apartmentToCard,
  apartmentToDetail,
};
