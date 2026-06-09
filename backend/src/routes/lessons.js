const express = require('express');
const { Op } = require('sequelize');
const { Lesson, User, TeacherProfile } = require('../models');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    const where = req.user.role === 'teacher'
      ? { teacherId: req.user.id }
      : { studentId: req.user.id };

    const include = [
      {
        model: User,
        as: req.user.role === 'teacher' ? 'Student' : 'Teacher',
        attributes: ['id', 'name', 'email'],
        ...(search != null && String(search).trim() !== ''
          ? { where: { name: { [Op.like]: `%${String(search).trim()}%` } }, required: true }
          : {}),
      },
      {
        model: User,
        as: req.user.role === 'teacher' ? 'Teacher' : 'Student',
        attributes: ['id', 'name', 'email'],
      },
    ];

    const lessons = await Lesson.findAll({
      where,
      include,
      order: [['id', 'DESC']],
    });

    res.json(lessons.map((lesson) => ({
      id: lesson.id,
      date: lesson.date,
      time: lesson.time,
      comment: lesson.comment,
      status: lesson.status,
      student: lesson.Student ? { id: lesson.Student.id, name: lesson.Student.name, email: lesson.Student.email } : null,
      teacher: lesson.Teacher ? { id: lesson.Teacher.id, name: lesson.Teacher.name, email: lesson.Teacher.email } : null,
      createdAt: lesson.createdAt,
      updatedAt: lesson.updatedAt,
    })));
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch lessons' });
  }
});

router.post('/', requireRole('student'), async (req, res) => {
  try {
    const { teacherId, date, time, comment } = req.body;
    if (!teacherId || !date || !time || !comment) {
      return res.status(400).json({ error: 'teacherId, date, time and comment are required' });
    }

    const teacherIdNum = parseInt(teacherId, 10);
    if (Number.isNaN(teacherIdNum)) {
      return res.status(400).json({ error: 'Invalid teacherId' });
    }

    const teacher = await User.findOne({
      where: { id: teacherIdNum, role: 'teacher' },
      include: [{ model: TeacherProfile }],
    });
    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }
    if (teacher.id === req.user.id) {
      return res.status(400).json({ error: 'Cannot book yourself' });
    }

    const lesson = await Lesson.create({
      studentId: req.user.id,
      teacherId: teacherIdNum,
      date,
      time: String(time).trim(),
      comment: String(comment).trim(),
      status: 'pending',
    });

    res.status(201).json({
      id: lesson.id,
      date: lesson.date,
      time: lesson.time,
      comment: lesson.comment,
      status: lesson.status,
      teacher: { id: teacher.id, name: teacher.name },
      student: { id: req.user.id, name: req.user.name },
    });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to create lesson' });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const lesson = await Lesson.findByPk(req.params.id);
    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'status is required' });
    }

    if (req.user.role === 'student') {
      if (lesson.studentId !== req.user.id) {
        return res.status(403).json({ error: 'You can only update your own lessons' });
      }
      if (status !== 'cancelled') {
        return res.status(400).json({ error: 'Student can only cancel lessons' });
      }
      if (lesson.status !== 'pending') {
        return res.status(400).json({ error: 'Only pending lessons can be cancelled' });
      }
      lesson.status = 'cancelled';
    } else if (req.user.role === 'teacher') {
      if (lesson.teacherId !== req.user.id) {
        return res.status(403).json({ error: 'You can only update lessons assigned to you' });
      }
      if (!['accepted', 'rejected'].includes(status)) {
        return res.status(400).json({ error: 'Teacher can only accept or reject lessons' });
      }
      if (lesson.status !== 'pending') {
        return res.status(400).json({ error: 'Only pending lessons can be updated' });
      }
      lesson.status = status;
    } else {
      return res.status(403).json({ error: 'Access denied' });
    }

    await lesson.save();

    const student = await User.findByPk(lesson.studentId, { attributes: ['id', 'name', 'email'] });
    const teacher = await User.findByPk(lesson.teacherId, { attributes: ['id', 'name', 'email'] });

    res.json({
      id: lesson.id,
      date: lesson.date,
      time: lesson.time,
      comment: lesson.comment,
      status: lesson.status,
      student,
      teacher,
    });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to update lesson' });
  }
});

module.exports = router;
