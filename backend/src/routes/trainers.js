const express = require('express');
const { Op } = require('sequelize');
const { User, TrainerProfile, Specialization } = require('../models');
const { trainerToCard } = require('../utils/helpers');

const router = express.Router();

const DEFAULT_LIMIT = 20;

router.get('/', async (req, res) => {
  try {
    const {
      specializationId,
      clientLevel,
      clientLevels,
      sortBy,
      sortOrder,
      limit,
      offset,
      search,
    } = req.query;

    const where = { role: 'trainer' };
    const profileWhere = {};

    if (search != null && String(search).trim() !== '') {
      where.name = { [Op.like]: `%${String(search).trim()}%` };
    }

    const levels = parseClientLevels(clientLevels || clientLevel);
    if (levels?.length) {
      profileWhere[Op.or] = levels.map((level) => ({
        clientLevels: { [Op.like]: `%${level}%` },
      }));
    }

    const limitNum = limit != null ? parseInt(limit, 10) : DEFAULT_LIMIT;
    const offsetNum = offset != null ? parseInt(offset, 10) : 0;
    if (Number.isNaN(limitNum) || limitNum < 1 || limitNum > 20) {
      return res.status(400).json({ error: 'Limit must be between 1 and 20' });
    }
    if (Number.isNaN(offsetNum) || offsetNum < 0) {
      return res.status(400).json({ error: 'Invalid offset' });
    }

    const include = [
      {
        model: TrainerProfile,
        required: Object.keys(profileWhere).length > 0,
        where: Object.keys(profileWhere).length > 0 ? profileWhere : undefined,
      },
      {
        model: Specialization,
        as: 'Specializations',
        attributes: ['id', 'name'],
        through: { attributes: [] },
        ...(specializationId != null && specializationId !== ''
          ? { where: { id: parseInt(specializationId, 10) }, required: true }
          : {}),
      },
    ];

    if (specializationId != null && specializationId !== '' && Number.isNaN(parseInt(specializationId, 10))) {
      return res.status(400).json({ error: 'Invalid specializationId' });
    }

    const order = [];
    if (sortBy === 'rating') {
      order.push([TrainerProfile, 'rating', sortOrder === 'asc' ? 'ASC' : 'DESC']);
    } else {
      order.push(['id', 'ASC']);
    }

    const { rows, count } = await User.findAndCountAll({
      where,
      include,
      distinct: true,
      limit: limitNum,
      offset: offsetNum,
      order,
    });

    const trainers = await Promise.all(rows.map(async (user) => {
      const profile = user.TrainerProfile;
      const specializations = user.Specializations || [];
      return trainerToCard(user, profile, specializations);
    }));

    res.json({ items: trainers, total: count, limit: limitNum, offset: offsetNum });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch trainers' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const trainerId = parseInt(req.params.id, 10);
    if (Number.isNaN(trainerId)) {
      return res.status(400).json({ error: 'Invalid trainer id' });
    }

    const user = await User.findOne({
      where: { id: trainerId, role: 'trainer' },
      include: [
        { model: TrainerProfile },
        {
          model: Specialization,
          as: 'Specializations',
          attributes: ['id', 'name'],
          through: { attributes: [] },
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ error: 'Trainer not found' });
    }

    res.json(await trainerToCard(user, user.TrainerProfile, user.Specializations));
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch trainer' });
  }
});

function parseClientLevels(value) {
  if (value == null || value === '') return null;
  if (Array.isArray(value)) return value;
  return String(value).split(',').map((item) => item.trim()).filter(Boolean);
}

module.exports = router;
