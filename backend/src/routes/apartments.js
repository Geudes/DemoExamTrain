const express = require('express');
const { Op } = require('sequelize');
const { Apartment, User, OwnerProfile } = require('../models');
const { APARTMENT_TYPES } = require('../models/Apartment');
const { authMiddleware, optionalAuthMiddleware, requireRole } = require('../middleware/auth');
const { apartmentToCard, apartmentToDetail, parseJsonArray } = require('../utils/helpers');

const router = express.Router();

const DEFAULT_LIMIT = 20;

function validateApartmentPayload(body, isUpdate = false) {
  const {
    title,
    type,
    city,
    address,
    description,
    pricePerNight,
    rooms,
    maxGuests,
  } = body;

  if (!isUpdate) {
    if (!title || !type || !city || !address || !description) {
      return 'title, type, city, address and description are required';
    }
    if (pricePerNight == null || rooms == null || maxGuests == null) {
      return 'pricePerNight, rooms and maxGuests are required';
    }
  }

  if (type !== undefined && !APARTMENT_TYPES.includes(type)) {
    return 'Invalid apartment type';
  }

  if (pricePerNight !== undefined) {
    const price = parseFloat(pricePerNight);
    if (Number.isNaN(price) || price <= 0) {
      return 'pricePerNight must be a positive number';
    }
  }

  if (rooms !== undefined) {
    const roomsNum = parseInt(rooms, 10);
    if (Number.isNaN(roomsNum) || roomsNum < 1) {
      return 'rooms must be a positive integer';
    }
  }

  if (maxGuests !== undefined) {
    const guestsNum = parseInt(maxGuests, 10);
    if (Number.isNaN(guestsNum) || guestsNum < 1) {
      return 'maxGuests must be a positive integer';
    }
  }

  return null;
}

router.get('/', optionalAuthMiddleware, async (req, res) => {
  try {
    const {
      city,
      type,
      rooms,
      priceMin,
      priceMax,
      sortBy,
      sortOrder,
      limit,
      offset,
      mine,
      search,
    } = req.query;

    const where = {};

    if (mine === 'true') {
      if (!req.user || req.user.role !== 'owner') {
        return res.status(403).json({ error: 'Only owner can view own listings' });
      }
      where.ownerId = req.user.id;
    } else {
      where.published = true;
    }

    if (city != null && String(city).trim() !== '') {
      where.city = String(city).trim();
    }

    if (type != null && String(type).trim() !== '') {
      if (!APARTMENT_TYPES.includes(String(type).trim())) {
        return res.status(400).json({ error: 'Invalid apartment type' });
      }
      where.type = String(type).trim();
    }

    if (rooms != null && String(rooms).trim() !== '') {
      const roomsNum = parseInt(rooms, 10);
      if (Number.isNaN(roomsNum) || roomsNum < 1) {
        return res.status(400).json({ error: 'Invalid rooms value' });
      }
      where.rooms = roomsNum;
    }

    if (priceMin != null && String(priceMin).trim() !== '') {
      const min = parseFloat(priceMin);
      if (Number.isNaN(min) || min < 0) {
        return res.status(400).json({ error: 'Invalid priceMin' });
      }
      where.pricePerNight = { ...(where.pricePerNight || {}), [Op.gte]: min };
    }

    if (priceMax != null && String(priceMax).trim() !== '') {
      const max = parseFloat(priceMax);
      if (Number.isNaN(max) || max < 0) {
        return res.status(400).json({ error: 'Invalid priceMax' });
      }
      where.pricePerNight = { ...(where.pricePerNight || {}), [Op.lte]: max };
    }

    if (search != null && String(search).trim() !== '') {
      where.title = { [Op.like]: `%${String(search).trim()}%` };
    }

    const limitNum = limit != null ? parseInt(limit, 10) : DEFAULT_LIMIT;
    const offsetNum = offset != null ? parseInt(offset, 10) : 0;
    if (Number.isNaN(limitNum) || limitNum < 1 || limitNum > 20) {
      return res.status(400).json({ error: 'Limit must be between 1 and 20' });
    }
    if (Number.isNaN(offsetNum) || offsetNum < 0) {
      return res.status(400).json({ error: 'Invalid offset' });
    }

    const order = [];
    if (sortBy === 'price') {
      order.push(['pricePerNight', sortOrder === 'desc' ? 'DESC' : 'ASC']);
    } else if (sortBy === 'rating') {
      order.push(['rating', sortOrder === 'asc' ? 'ASC' : 'DESC']);
    } else {
      order.push(['id', 'ASC']);
    }

    const { rows, count } = await Apartment.findAndCountAll({
      where,
      limit: limitNum,
      offset: offsetNum,
      order,
    });

    res.json({
      items: rows.map(apartmentToCard),
      total: count,
      limit: limitNum,
      offset: offsetNum,
    });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch apartments' });
  }
});

router.get('/:id', optionalAuthMiddleware, async (req, res) => {
  try {
    const apartmentId = parseInt(req.params.id, 10);
    if (Number.isNaN(apartmentId)) {
      return res.status(400).json({ error: 'Invalid apartment id' });
    }

    const apartment = await Apartment.findByPk(apartmentId, {
      include: [{
        model: User,
        as: 'Owner',
        attributes: ['id', 'name', 'email'],
        include: [{ model: OwnerProfile }],
      }],
    });

    if (!apartment) {
      return res.status(404).json({ error: 'Apartment not found' });
    }

    const isOwner = req.user?.id === apartment.ownerId;
    if (!apartment.published && !isOwner) {
      return res.status(404).json({ error: 'Apartment not found' });
    }

    res.json(apartmentToDetail(apartment, apartment.Owner));
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch apartment' });
  }
});

router.post('/', authMiddleware, requireRole('owner'), async (req, res) => {
  try {
    const validationError = validateApartmentPayload(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const {
      title,
      type,
      city,
      address,
      description,
      shortDescription,
      pricePerNight,
      rooms,
      maxGuests,
      amenities,
      photos,
      published,
      rating,
    } = req.body;

    const apartment = await Apartment.create({
      ownerId: req.user.id,
      title: String(title).trim(),
      type,
      city: String(city).trim(),
      address: String(address).trim(),
      description: String(description).trim(),
      shortDescription: shortDescription != null ? String(shortDescription).trim() : null,
      pricePerNight: parseFloat(pricePerNight),
      rooms: parseInt(rooms, 10),
      maxGuests: parseInt(maxGuests, 10),
      amenities: parseJsonArray(amenities),
      photos: parseJsonArray(photos),
      published: published !== false,
      rating: rating != null ? parseFloat(rating) : 0,
    });

    res.status(201).json(apartmentToDetail(apartment, req.user));
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to create apartment' });
  }
});

router.put('/:id', authMiddleware, requireRole('owner'), async (req, res) => {
  try {
    const apartmentId = parseInt(req.params.id, 10);
    if (Number.isNaN(apartmentId)) {
      return res.status(400).json({ error: 'Invalid apartment id' });
    }

    const apartment = await Apartment.findByPk(apartmentId);
    if (!apartment) {
      return res.status(404).json({ error: 'Apartment not found' });
    }
    if (apartment.ownerId !== req.user.id) {
      return res.status(403).json({ error: 'You can only update your own apartments' });
    }

    const validationError = validateApartmentPayload(req.body, true);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const fields = [
      'title', 'type', 'city', 'address', 'description', 'shortDescription',
      'pricePerNight', 'rooms', 'maxGuests', 'published', 'rating',
    ];

    fields.forEach((field) => {
      if (req.body[field] === undefined) return;
      if (field === 'pricePerNight' || field === 'rating') {
        apartment[field] = parseFloat(req.body[field]);
      } else if (field === 'rooms' || field === 'maxGuests') {
        apartment[field] = parseInt(req.body[field], 10);
      } else if (field === 'published') {
        apartment[field] = Boolean(req.body[field]);
      } else {
        apartment[field] = String(req.body[field]).trim();
      }
    });

    if (req.body.amenities !== undefined) {
      apartment.amenities = parseJsonArray(req.body.amenities);
    }
    if (req.body.photos !== undefined) {
      apartment.photos = parseJsonArray(req.body.photos);
    }

    await apartment.save();

    const owner = await User.findByPk(apartment.ownerId, {
      attributes: ['id', 'name', 'email'],
      include: [{ model: OwnerProfile }],
    });

    res.json(apartmentToDetail(apartment, owner));
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to update apartment' });
  }
});

router.delete('/:id', authMiddleware, requireRole('owner'), async (req, res) => {
  try {
    const apartmentId = parseInt(req.params.id, 10);
    if (Number.isNaN(apartmentId)) {
      return res.status(400).json({ error: 'Invalid apartment id' });
    }

    const apartment = await Apartment.findByPk(apartmentId);
    if (!apartment) {
      return res.status(404).json({ error: 'Apartment not found' });
    }
    if (apartment.ownerId !== req.user.id) {
      return res.status(403).json({ error: 'You can only delete your own apartments' });
    }

    await apartment.destroy();
    res.json({ message: 'Apartment deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to delete apartment' });
  }
});

module.exports = router;
