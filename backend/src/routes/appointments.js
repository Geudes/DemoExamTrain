const express = require('express');
const { Op } = require('sequelize');
const { Appointment, User, DoctorProfile } = require('../models');
const { authMiddleware, requireRole } = require('../middleware/auth');
const { validateVisitFormats } = require('../utils/helpers');

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    const searchTerm = search != null ? String(search).trim() : '';

    const where = req.user.role === 'doctor'
      ? { doctorId: req.user.id }
      : { patientId: req.user.id };

    const include = [
      {
        model: User,
        as: req.user.role === 'doctor' ? 'Patient' : 'Doctor',
        attributes: ['id', 'name', 'email'],
        ...(searchTerm
          ? { where: { name: { [Op.like]: `%${searchTerm}%` } }, required: true }
          : {}),
      },
      {
        model: User,
        as: req.user.role === 'doctor' ? 'Doctor' : 'Patient',
        attributes: ['id', 'name', 'email'],
      },
    ];

    const appointments = await Appointment.findAll({
      where,
      include,
      order: [['id', 'DESC']],
    });

    res.json(appointments.map(formatAppointment));
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch appointments' });
  }
});

router.post('/', requireRole('patient'), async (req, res) => {
  try {
    const { doctorId, date, time, format, comment } = req.body;
    if (!doctorId || !date || !time || !format || !comment) {
      return res.status(400).json({ error: 'doctorId, date, time, format and comment are required' });
    }

    if (!validateVisitFormats([format])) {
      return res.status(400).json({ error: 'Invalid format. Allowed: in_person, online' });
    }

    const doctorIdNum = parseInt(doctorId, 10);
    if (Number.isNaN(doctorIdNum)) {
      return res.status(400).json({ error: 'Invalid doctorId' });
    }

    const doctor = await User.findOne({
      where: { id: doctorIdNum, role: 'doctor' },
      include: [{ model: DoctorProfile }],
    });
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    if (doctor.id === req.user.id) {
      return res.status(400).json({ error: 'Cannot book yourself' });
    }

    const doctorFormats = doctor.DoctorProfile?.visitFormats || [];
    if (doctorFormats.length > 0 && !doctorFormats.includes(format)) {
      return res.status(400).json({ error: 'Selected format is not available for this doctor' });
    }

    const appointment = await Appointment.create({
      patientId: req.user.id,
      doctorId: doctorIdNum,
      date,
      time: String(time).trim(),
      format,
      comment: String(comment).trim(),
      status: 'pending',
    });

    res.status(201).json(formatAppointment({
      ...appointment.toJSON(),
      Doctor: { id: doctor.id, name: doctor.name, email: doctor.email },
      Patient: { id: req.user.id, name: req.user.name, email: req.user.email },
    }));
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to create appointment' });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'status is required' });
    }

    if (req.user.role === 'patient') {
      if (appointment.patientId !== req.user.id) {
        return res.status(403).json({ error: 'You can only update your own appointments' });
      }
      if (status !== 'cancelled') {
        return res.status(400).json({ error: 'Patient can only cancel appointments' });
      }
      if (appointment.status !== 'pending') {
        return res.status(400).json({ error: 'Only pending appointments can be cancelled' });
      }
      appointment.status = 'cancelled';
    } else if (req.user.role === 'doctor') {
      if (appointment.doctorId !== req.user.id) {
        return res.status(403).json({ error: 'You can only update appointments assigned to you' });
      }
      if (!['confirmed', 'rejected'].includes(status)) {
        return res.status(400).json({ error: 'Doctor can only confirm or reject appointments' });
      }
      if (appointment.status !== 'pending') {
        return res.status(400).json({ error: 'Only pending appointments can be updated' });
      }
      appointment.status = status;
    } else {
      return res.status(403).json({ error: 'Access denied' });
    }

    await appointment.save();

    const patient = await User.findByPk(appointment.patientId, { attributes: ['id', 'name', 'email'] });
    const doctor = await User.findByPk(appointment.doctorId, { attributes: ['id', 'name', 'email'] });

    res.json(formatAppointment({
      ...appointment.toJSON(),
      Patient: patient,
      Doctor: doctor,
    }));
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to update appointment' });
  }
});

function formatAppointment(appointment) {
  return {
    id: appointment.id,
    date: appointment.date,
    time: appointment.time,
    format: appointment.format,
    comment: appointment.comment,
    status: appointment.status,
    patient: appointment.Patient ? {
      id: appointment.Patient.id,
      name: appointment.Patient.name,
      email: appointment.Patient.email,
    } : null,
    doctor: appointment.Doctor ? {
      id: appointment.Doctor.id,
      name: appointment.Doctor.name,
      email: appointment.Doctor.email,
    } : null,
    createdAt: appointment.createdAt,
    updatedAt: appointment.updatedAt,
  };
}

module.exports = router;
