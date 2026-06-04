const express = require('express');
const { Op } = require('sequelize');
const { Specialization, TrainerSpecialization } = require('../models');
const { authMiddleware, requireRole, optionalAuthMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/', optionalAuthMiddleware, async (req, res) => {
  try {
    const { search } = req.query;
    const where = {};

    if (search != null && String(search).trim() !== '') {
      where.name = { [Op.like]: `%${String(search).trim()}%` };
    }

    const specializations = await Specialization.findAll({
      where,
      order: [['name', 'ASC']],
    });

    let selectedIds = [];
    if (req.user?.role === 'trainer') {
      const selected = await TrainerSpecialization.findAll({
        where: { trainerId: req.user.id },
        attributes: ['specializationId'],
      });
      selectedIds = selected.map((item) => item.specializationId);
    }

    res.json(specializations.map((item) => ({
      id: item.id,
      name: item.name,
      selected: selectedIds.includes(item.id),
    })));
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch specializations' });
  }
});

router.post('/', authMiddleware, requireRole('trainer'), async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !String(name).trim()) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const normalizedName = String(name).trim();
    const existing = await Specialization.findOne({
      where: { name: normalizedName },
    });
    if (existing) {
      return res.status(400).json({ error: 'Specialization already exists' });
    }

    const specialization = await Specialization.create({ name: normalizedName });
    res.status(201).json({ id: specialization.id, name: specialization.name, selected: false });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to create specialization' });
  }
});

router.post('/selected', authMiddleware, requireRole('trainer'), async (req, res) => {
  try {
    const { specializationIds, specializationId } = req.body;
    const ids = specializationIds || (specializationId != null ? [specializationId] : []);

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'specializationIds is required' });
    }

    const created = [];
    for (const id of ids) {
      const specId = parseInt(id, 10);
      if (Number.isNaN(specId)) {
        return res.status(400).json({ error: 'Invalid specialization id' });
      }

      const specialization = await Specialization.findByPk(specId);
      if (!specialization) {
        return res.status(404).json({ error: `Specialization ${specId} not found` });
      }

      const [record] = await TrainerSpecialization.findOrCreate({
        where: { trainerId: req.user.id, specializationId: specId },
        defaults: { trainerId: req.user.id, specializationId: specId },
      });
      created.push({ id: specialization.id, name: specialization.name, selected: true, recordId: record.id });
    }

    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to select specializations' });
  }
});

router.delete('/selected', authMiddleware, requireRole('trainer'), async (req, res) => {
  try {
    const { specializationIds, specializationId } = req.body;
    const ids = specializationIds || (specializationId != null ? [specializationId] : []);

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'specializationIds is required' });
    }

    for (const id of ids) {
      const specId = parseInt(id, 10);
      if (Number.isNaN(specId)) {
        return res.status(400).json({ error: 'Invalid specialization id' });
      }
      await TrainerSpecialization.destroy({
        where: { trainerId: req.user.id, specializationId: specId },
      });
    }

    res.json({ message: 'Selected specializations removed' });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to remove specializations' });
  }
});

module.exports = router;
