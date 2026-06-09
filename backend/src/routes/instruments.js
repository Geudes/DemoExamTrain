const express = require('express');
const { Op } = require('sequelize');
const { Instrument, TeacherInstrument } = require('../models');
const { authMiddleware, requireRole, optionalAuthMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/', optionalAuthMiddleware, async (req, res) => {
  try {
    const { search } = req.query;
    const where = {};

    if (search != null && String(search).trim() !== '') {
      where.name = { [Op.like]: `%${String(search).trim()}%` };
    }

    const instruments = await Instrument.findAll({
      where,
      order: [['name', 'ASC']],
    });

    let selectedIds = [];
    if (req.user?.role === 'teacher') {
      const selected = await TeacherInstrument.findAll({
        where: { teacherId: req.user.id },
        attributes: ['instrumentId'],
      });
      selectedIds = selected.map((item) => item.instrumentId);
    }

    res.json(instruments.map((item) => ({
      id: item.id,
      name: item.name,
      selected: selectedIds.includes(item.id),
    })));
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch instruments' });
  }
});

router.post('/', authMiddleware, requireRole('teacher'), async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !String(name).trim()) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const normalizedName = String(name).trim();
    const existing = await Instrument.findOne({
      where: { name: normalizedName },
    });
    if (existing) {
      return res.status(400).json({ error: 'Instrument already exists' });
    }

    const instrument = await Instrument.create({ name: normalizedName });
    res.status(201).json({ id: instrument.id, name: instrument.name, selected: false });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to create instrument' });
  }
});

router.post('/selected', authMiddleware, requireRole('teacher'), async (req, res) => {
  try {
    const { instrumentIds, instrumentId } = req.body;
    const ids = instrumentIds || (instrumentId != null ? [instrumentId] : []);

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'instrumentIds is required' });
    }

    const created = [];
    for (const id of ids) {
      const instId = parseInt(id, 10);
      if (Number.isNaN(instId)) {
        return res.status(400).json({ error: 'Invalid instrument id' });
      }

      const instrument = await Instrument.findByPk(instId);
      if (!instrument) {
        return res.status(404).json({ error: `Instrument ${instId} not found` });
      }

      const [record] = await TeacherInstrument.findOrCreate({
        where: { teacherId: req.user.id, instrumentId: instId },
        defaults: { teacherId: req.user.id, instrumentId: instId },
      });
      created.push({ id: instrument.id, name: instrument.name, selected: true, recordId: record.id });
    }

    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to select instruments' });
  }
});

router.delete('/selected', authMiddleware, requireRole('teacher'), async (req, res) => {
  try {
    const { instrumentIds, instrumentId } = req.body;
    const ids = instrumentIds || (instrumentId != null ? [instrumentId] : []);

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'instrumentIds is required' });
    }

    for (const id of ids) {
      const instId = parseInt(id, 10);
      if (Number.isNaN(instId)) {
        return res.status(400).json({ error: 'Invalid instrument id' });
      }
      await TeacherInstrument.destroy({
        where: { teacherId: req.user.id, instrumentId: instId },
      });
    }

    res.json({ message: 'Selected instruments removed' });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to remove instruments' });
  }
});

module.exports = router;
