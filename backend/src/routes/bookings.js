const express = require('express');
const { Op } = require('sequelize');
const { Booking, User, TrainerProfile } = require('../models');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    const where = req.user.role === 'trainer'
      ? { trainerId: req.user.id }
      : { clientId: req.user.id };

    const include = [
      {
        model: User,
        as: req.user.role === 'trainer' ? 'Client' : 'Trainer',
        attributes: ['id', 'name', 'email'],
        ...(search != null && String(search).trim() !== ''
          ? { where: { name: { [Op.like]: `%${String(search).trim()}%` } }, required: true }
          : {}),
      },
      {
        model: User,
        as: req.user.role === 'trainer' ? 'Trainer' : 'Client',
        attributes: ['id', 'name', 'email'],
      },
    ];

    const bookings = await Booking.findAll({
      where,
      include,
      order: [['id', 'DESC']],
    });

    res.json(bookings.map((booking) => ({
      id: booking.id,
      date: booking.date,
      time: booking.time,
      comment: booking.comment,
      status: booking.status,
      client: booking.Client ? { id: booking.Client.id, name: booking.Client.name, email: booking.Client.email } : null,
      trainer: booking.Trainer ? { id: booking.Trainer.id, name: booking.Trainer.name, email: booking.Trainer.email } : null,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
    })));
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch bookings' });
  }
});

router.post('/', requireRole('client'), async (req, res) => {
  try {
    const { trainerId, date, time, comment } = req.body;
    if (!trainerId || !date || !time || !comment) {
      return res.status(400).json({ error: 'trainerId, date, time and comment are required' });
    }

    const trainerIdNum = parseInt(trainerId, 10);
    if (Number.isNaN(trainerIdNum)) {
      return res.status(400).json({ error: 'Invalid trainerId' });
    }

    const trainer = await User.findOne({
      where: { id: trainerIdNum, role: 'trainer' },
      include: [{ model: TrainerProfile }],
    });
    if (!trainer) {
      return res.status(404).json({ error: 'Trainer not found' });
    }
    if (trainer.id === req.user.id) {
      return res.status(400).json({ error: 'Cannot book yourself' });
    }

    const booking = await Booking.create({
      clientId: req.user.id,
      trainerId: trainerIdNum,
      date,
      time: String(time).trim(),
      comment: String(comment).trim(),
      status: 'pending',
    });

    res.status(201).json({
      id: booking.id,
      date: booking.date,
      time: booking.time,
      comment: booking.comment,
      status: booking.status,
      trainer: { id: trainer.id, name: trainer.name },
      client: { id: req.user.id, name: req.user.name },
    });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to create booking' });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'status is required' });
    }

    if (req.user.role === 'client') {
      if (booking.clientId !== req.user.id) {
        return res.status(403).json({ error: 'You can only update your own bookings' });
      }
      if (status !== 'cancelled') {
        return res.status(400).json({ error: 'Client can only cancel bookings' });
      }
      if (booking.status !== 'pending') {
        return res.status(400).json({ error: 'Only pending bookings can be cancelled' });
      }
      booking.status = 'cancelled';
    } else if (req.user.role === 'trainer') {
      if (booking.trainerId !== req.user.id) {
        return res.status(403).json({ error: 'You can only update bookings assigned to you' });
      }
      if (!['accepted', 'rejected'].includes(status)) {
        return res.status(400).json({ error: 'Trainer can only accept or reject bookings' });
      }
      if (booking.status !== 'pending') {
        return res.status(400).json({ error: 'Only pending bookings can be updated' });
      }
      booking.status = status;
    } else {
      return res.status(403).json({ error: 'Access denied' });
    }

    await booking.save();

    const client = await User.findByPk(booking.clientId, { attributes: ['id', 'name', 'email'] });
    const trainer = await User.findByPk(booking.trainerId, { attributes: ['id', 'name', 'email'] });

    res.json({
      id: booking.id,
      date: booking.date,
      time: booking.time,
      comment: booking.comment,
      status: booking.status,
      client,
      trainer,
    });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to update booking' });
  }
});

module.exports = router;
