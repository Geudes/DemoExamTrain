const express = require('express');
const bcrypt = require('bcryptjs');
const {
  User, DoctorProfile, Appointment, DoctorSpecialization, RefreshToken,
} = require('../models');
const { authMiddleware } = require('../middleware/auth');
const { userToResponse, validateVisitFormats, parseVisitFormats } = require('../utils/helpers');

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
    const {
      name,
      email,
      password,
      about,
      photo,
      price,
      rating,
      contacts,
      visitFormats,
    } = req.body;
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

    if (user.role === 'doctor') {
      const [profile] = await DoctorProfile.findOrCreate({
        where: { userId: user.id },
        defaults: { userId: user.id },
      });

      if (about !== undefined) profile.about = String(about).trim() || null;
      if (photo !== undefined) profile.photo = String(photo).trim() || null;
      if (contacts !== undefined) profile.contacts = String(contacts).trim() || null;

      if (price !== undefined) {
        const priceNum = parseFloat(price);
        if (Number.isNaN(priceNum) || priceNum < 0) {
          return res.status(400).json({ error: 'Invalid price' });
        }
        profile.price = priceNum;
      }

      if (rating !== undefined) {
        const ratingNum = parseFloat(rating);
        if (Number.isNaN(ratingNum) || ratingNum < 0 || ratingNum > 5) {
          return res.status(400).json({ error: 'Rating must be between 0 and 5' });
        }
        profile.rating = ratingNum;
      }

      if (visitFormats !== undefined) {
        const formats = parseVisitFormats(visitFormats);
        if (!validateVisitFormats(formats)) {
          return res.status(400).json({ error: 'Invalid visit formats. Allowed: in_person, online' });
        }
        profile.visitFormats = formats;
      }

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

    await RefreshToken.destroy({ where: { userId } });
    await DoctorSpecialization.destroy({ where: { doctorId: userId } });
    await Appointment.destroy({ where: { patientId: userId } });
    await Appointment.destroy({ where: { doctorId: userId } });
    await DoctorProfile.destroy({ where: { userId } });
    await User.destroy({ where: { id: userId } });

    res.json({ message: 'Account deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to delete account' });
  }
});

module.exports = router;
