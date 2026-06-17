const express = require('express');
const { Op } = require('sequelize');
const { Booking, User, Apartment } = require('../models');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    const searchTerm = search != null ? String(search).trim() : '';

    if (req.user.role === 'owner') {
      const apartments = await Apartment.findAll({
        where: { ownerId: req.user.id },
        attributes: ['id'],
      });
      const apartmentIds = apartments.map((item) => item.id);

      if (apartmentIds.length === 0) {
        return res.json([]);
      }

      const apartmentWhere = searchTerm
        ? { title: { [Op.like]: `%${searchTerm}%` } }
        : {};

      const bookings = await Booking.findAll({
        where: { apartmentId: apartmentIds },
        include: [
          {
            model: User,
            as: 'Tenant',
            attributes: ['id', 'name', 'email'],
            ...(searchTerm ? { where: { name: { [Op.like]: `%${searchTerm}%` } }, required: false } : {}),
          },
          {
            model: Apartment,
            as: 'Apartment',
            attributes: ['id', 'title', 'city'],
            where: apartmentWhere,
            required: true,
          },
        ],
        order: [['id', 'DESC']],
      });

      const filtered = searchTerm
        ? bookings.filter((booking) => {
          const tenantMatch = booking.Tenant?.name?.toLowerCase().includes(searchTerm.toLowerCase());
          const apartmentMatch = booking.Apartment?.title?.toLowerCase().includes(searchTerm.toLowerCase());
          return tenantMatch || apartmentMatch;
        })
        : bookings;

      return res.json(filtered.map(formatBooking));
    }

    const include = [
      {
        model: Apartment,
        as: 'Apartment',
        attributes: ['id', 'title', 'city'],
        ...(searchTerm
          ? { where: { title: { [Op.like]: `%${searchTerm}%` } }, required: true }
          : {}),
      },
      {
        model: User,
        as: 'Tenant',
        attributes: ['id', 'name', 'email'],
      },
    ];

    const bookings = await Booking.findAll({
      where: { tenantId: req.user.id },
      include,
      order: [['id', 'DESC']],
    });

    res.json(bookings.map(formatBooking));
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch bookings' });
  }
});

router.post('/', requireRole('tenant'), async (req, res) => {
  try {
    const { apartmentId, checkIn, checkOut, guests, comment } = req.body;
    if (!apartmentId || !checkIn || !checkOut || guests == null || !comment) {
      return res.status(400).json({ error: 'apartmentId, checkIn, checkOut, guests and comment are required' });
    }

    const apartmentIdNum = parseInt(apartmentId, 10);
    if (Number.isNaN(apartmentIdNum)) {
      return res.status(400).json({ error: 'Invalid apartmentId' });
    }

    const guestsNum = parseInt(guests, 10);
    if (Number.isNaN(guestsNum) || guestsNum < 1) {
      return res.status(400).json({ error: 'guests must be greater than 0' });
    }

    if (new Date(checkOut) < new Date(checkIn)) {
      return res.status(400).json({ error: 'checkOut cannot be earlier than checkIn' });
    }

    const apartment = await Apartment.findOne({
      where: { id: apartmentIdNum, published: true },
    });
    if (!apartment) {
      return res.status(404).json({ error: 'Apartment not found' });
    }
    if (apartment.ownerId === req.user.id) {
      return res.status(400).json({ error: 'Cannot book your own apartment' });
    }
    if (guestsNum > apartment.maxGuests) {
      return res.status(400).json({ error: `Maximum guests for this apartment is ${apartment.maxGuests}` });
    }

    const booking = await Booking.create({
      tenantId: req.user.id,
      apartmentId: apartmentIdNum,
      checkIn,
      checkOut,
      guests: guestsNum,
      comment: String(comment).trim(),
      status: 'pending',
    });

    res.status(201).json(formatBooking({
      ...booking.toJSON(),
      Tenant: { id: req.user.id, name: req.user.name, email: req.user.email },
      Apartment: { id: apartment.id, title: apartment.title, city: apartment.city },
    }));
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to create booking' });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id, {
      include: [{ model: Apartment, as: 'Apartment' }],
    });
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'status is required' });
    }

    if (req.user.role === 'tenant') {
      if (booking.tenantId !== req.user.id) {
        return res.status(403).json({ error: 'You can only update your own bookings' });
      }
      if (status !== 'cancelled') {
        return res.status(400).json({ error: 'Tenant can only cancel bookings' });
      }
      if (booking.status !== 'pending') {
        return res.status(400).json({ error: 'Only pending bookings can be cancelled' });
      }
      booking.status = 'cancelled';
    } else if (req.user.role === 'owner') {
      if (booking.Apartment?.ownerId !== req.user.id) {
        return res.status(403).json({ error: 'You can only update bookings for your apartments' });
      }
      if (!['confirmed', 'rejected'].includes(status)) {
        return res.status(400).json({ error: 'Owner can only confirm or reject bookings' });
      }
      if (booking.status !== 'pending') {
        return res.status(400).json({ error: 'Only pending bookings can be updated' });
      }
      booking.status = status;
    } else {
      return res.status(403).json({ error: 'Access denied' });
    }

    await booking.save();

    const fullBooking = await Booking.findByPk(booking.id, {
      include: [
        { model: User, as: 'Tenant', attributes: ['id', 'name', 'email'] },
        { model: Apartment, as: 'Apartment', attributes: ['id', 'title', 'city'] },
      ],
    });

    res.json(formatBooking(fullBooking));
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to update booking' });
  }
});

function formatBooking(booking) {
  return {
    id: booking.id,
    checkIn: booking.checkIn,
    checkOut: booking.checkOut,
    guests: booking.guests,
    comment: booking.comment,
    status: booking.status,
    tenant: booking.Tenant ? {
      id: booking.Tenant.id,
      name: booking.Tenant.name,
      email: booking.Tenant.email,
    } : null,
    apartment: booking.Apartment ? {
      id: booking.Apartment.id,
      title: booking.Apartment.title,
      city: booking.Apartment.city,
    } : null,
    createdAt: booking.createdAt,
    updatedAt: booking.updatedAt,
  };
}

module.exports = router;
