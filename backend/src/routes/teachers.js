const express = require('express');
const { Op } = require('sequelize');
const { User, TeacherProfile, Instrument } = require('../models');
const { teacherToCard, parseStudentLevels } = require('../utils/helpers');

const router = express.Router();

const DEFAULT_LIMIT = 20;

router.get('/', async (req, res) => {
  try {
    const {
      instrumentId,
      studentLevel,
      studentLevels,
      sortBy,
      sortOrder,
      limit,
      offset,
      search,
    } = req.query;

    const where = { role: 'teacher' };
    const profileWhere = {};

    if (search != null && String(search).trim() !== '') {
      where.name = { [Op.like]: `%${String(search).trim()}%` };
    }

    const levels = parseStudentLevels(studentLevels || studentLevel);
    if (levels?.length) {
      profileWhere[Op.or] = levels.map((level) => ({
        studentLevels: { [Op.like]: `%${level}%` },
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
        model: TeacherProfile,
        required: Object.getOwnPropertySymbols(profileWhere).length > 0,
        where: Object.getOwnPropertySymbols(profileWhere).length > 0 ? profileWhere : undefined,
      },
      {
        model: Instrument,
        as: 'Instruments',
        attributes: ['id', 'name'],
        through: { attributes: [] },
        ...(instrumentId != null && instrumentId !== ''
          ? { where: { id: parseInt(instrumentId, 10) }, required: true }
          : {}),
      },
    ];

    if (instrumentId != null && instrumentId !== '' && Number.isNaN(parseInt(instrumentId, 10))) {
      return res.status(400).json({ error: 'Invalid instrumentId' });
    }

    const order = [];
    if (sortBy === 'rating') {
      order.push([TeacherProfile, 'rating', sortOrder === 'asc' ? 'ASC' : 'DESC']);
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

    const teachers = await Promise.all(rows.map(async (user) => {
      const profile = user.TeacherProfile;
      const instruments = user.Instruments || [];
      return teacherToCard(user, profile, instruments);
    }));

    res.json({ items: teachers, total: count, limit: limitNum, offset: offsetNum });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch teachers' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const teacherId = parseInt(req.params.id, 10);
    if (Number.isNaN(teacherId)) {
      return res.status(400).json({ error: 'Invalid teacher id' });
    }

    const user = await User.findOne({
      where: { id: teacherId, role: 'teacher' },
      include: [
        { model: TeacherProfile },
        {
          model: Instrument,
          as: 'Instruments',
          attributes: ['id', 'name'],
          through: { attributes: [] },
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    res.json(await teacherToCard(user, user.TeacherProfile, user.Instruments));
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch teacher' });
  }
});

module.exports = router;
