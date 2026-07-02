const express = require('express');
const { Op } = require('sequelize');
const { User, DoctorProfile, Specialization } = require('../models');
const { doctorToCard, parseVisitFormats } = require('../utils/helpers');

const router = express.Router();

const DEFAULT_LIMIT = 20;

router.get('/', async (req, res) => {
  try {
    const {
      specializationId,
      visitFormat,
      visitFormats,
      ratingMin,
      priceMin,
      priceMax,
      sortBy,
      sortOrder,
      limit,
      offset,
      search,
    } = req.query;

    const where = { role: 'doctor' };
    const profileWhere = {};

    if (search != null && String(search).trim() !== '') {
      where.name = { [Op.like]: `%${String(search).trim()}%` };
    }

    const formats = parseVisitFormats(visitFormats || visitFormat);
    if (formats?.length) {
      profileWhere[Op.or] = formats.map((format) => ({
        visitFormats: { [Op.like]: `%${format}%` },
      }));
    }

    if (ratingMin != null && String(ratingMin).trim() !== '') {
      const rating = parseFloat(ratingMin);
      if (Number.isNaN(rating) || rating < 0) {
        return res.status(400).json({ error: 'Invalid ratingMin' });
      }
      profileWhere.rating = { [Op.gte]: rating };
    }

    if (priceMin != null && String(priceMin).trim() !== '') {
      const min = parseFloat(priceMin);
      if (Number.isNaN(min) || min < 0) {
        return res.status(400).json({ error: 'Invalid priceMin' });
      }
      profileWhere.price = { ...(profileWhere.price || {}), [Op.gte]: min };
    }

    if (priceMax != null && String(priceMax).trim() !== '') {
      const max = parseFloat(priceMax);
      if (Number.isNaN(max) || max < 0) {
        return res.status(400).json({ error: 'Invalid priceMax' });
      }
      profileWhere.price = { ...(profileWhere.price || {}), [Op.lte]: max };
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
        model: DoctorProfile,
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
      order.push([DoctorProfile, 'rating', sortOrder === 'asc' ? 'ASC' : 'DESC']);
    } else if (sortBy === 'price') {
      order.push([DoctorProfile, 'price', sortOrder === 'desc' ? 'DESC' : 'ASC']);
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

    const doctors = rows.map((user) => doctorToCard(
      user,
      user.DoctorProfile,
      user.Specializations || [],
    ));

    res.json({ items: doctors, total: count, limit: limitNum, offset: offsetNum });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch doctors' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const doctorId = parseInt(req.params.id, 10);
    if (Number.isNaN(doctorId)) {
      return res.status(400).json({ error: 'Invalid doctor id' });
    }

    const user = await User.findOne({
      where: { id: doctorId, role: 'doctor' },
      include: [
        { model: DoctorProfile },
        {
          model: Specialization,
          as: 'Specializations',
          attributes: ['id', 'name'],
          through: { attributes: [] },
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    res.json(doctorToCard(user, user.DoctorProfile, user.Specializations));
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch doctor' });
  }
});

module.exports = router;
