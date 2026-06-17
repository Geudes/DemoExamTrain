const express = require('express');
const bcrypt = require('bcryptjs');
const { User, OwnerProfile, Apartment, Booking, RefreshToken } = require('../models');
const { authMiddleware } = require('../middleware/auth');
const { userToResponse } = require('../utils/helpers');

const router = express.Router();

router.use(authMiddleware);

router.get('/me', async (req, res) => {
  try {
    res.json(await userToResponse(req.user));
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch profile' });
  }
});

router.put('/me', async (req, res) => {
  try {
    const { name, email, password, phone, description, avatar } = req.body;
    const user = req.user;

    if (name !== undefined) {
      const normalizedName = String(name).trim();
      if (normalizedName.length < 5 || normalizedName.length > 20) {
        return res.status(400).json({ error: 'Name must be between 5 and 20 characters' });
      }
      user.name = normalizedName;
    }

    if (email !== undefined) {
      const normalizedEmail = String(email).trim().toLowerCase();
      if (!normalizedEmail) {
        return res.status(400).json({ error: 'Email cannot be empty' });
      }
      const existing = await User.findOne({ where: { email: normalizedEmail } });
      if (existing && existing.id !== user.id) {
        return res.status(400).json({ error: 'User with this email already exists' });
      }
      user.email = normalizedEmail;
    }

    if (password !== undefined && password !== '') {
      if (String(password).length < 6 || String(password).length > 12) {
        return res.status(400).json({ error: 'Password must be between 6 and 12 characters' });
      }
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    if (user.role === 'owner') {
      const [profile] = await OwnerProfile.findOrCreate({
        where: { userId: user.id },
        defaults: { userId: user.id },
      });

      if (phone !== undefined) profile.phone = String(phone).trim() || null;
      if (description !== undefined) profile.description = String(description).trim() || null;
      if (avatar !== undefined) profile.avatar = String(avatar).trim() || null;

      await profile.save();
    }

    res.json(await userToResponse(user));
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to update profile' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    if (Number.isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user id' });
    }
    if (userId !== req.user.id) {
      return res.status(403).json({ error: 'You can only delete your own account' });
    }

    const apartments = await Apartment.findAll({ where: { ownerId: userId }, attributes: ['id'] });
    const apartmentIds = apartments.map((item) => item.id);

    await RefreshToken.destroy({ where: { userId } });
    if (apartmentIds.length > 0) {
      await Booking.destroy({ where: { apartmentId: apartmentIds } });
    }
    await Booking.destroy({ where: { tenantId: userId } });
    await Apartment.destroy({ where: { ownerId: userId } });
    await OwnerProfile.destroy({ where: { userId } });
    await User.destroy({ where: { id: userId } });

    res.json({ message: 'Account deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to delete account' });
  }
});

module.exports = router;
