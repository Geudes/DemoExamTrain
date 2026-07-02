require('dotenv').config();
const bcrypt = require('bcryptjs');
const {
  sequelize,
  User,
  DoctorProfile,
  Specialization,
  DoctorSpecialization,
  Appointment,
} = require('../src/models');

async function seed() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });

    const specializations = await Promise.all([
      Specialization.create({ name: 'Терапевт' }),
      Specialization.create({ name: 'Кардиолог' }),
      Specialization.create({ name: 'Невролог' }),
      Specialization.create({ name: 'Педиатр' }),
      Specialization.create({ name: 'Дерматолог' }),
    ]);

    const doctor = await User.create({
      email: 'doctor@mail.ru',
      password: await bcrypt.hash('Doctor123', 10),
      name: 'ИванПетров',
      role: 'doctor',
    });

    await DoctorProfile.create({
      userId: doctor.id,
      about: 'Врач-терапевт с 12-летним стажем. Специализируюсь на профилактике и лечении заболеваний.',
      photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400',
      price: 2500,
      rating: 4.9,
      contacts: '+7 (999) 123-45-67',
      visitFormats: ['in_person', 'online'],
    });

    await DoctorSpecialization.bulkCreate([
      { doctorId: doctor.id, specializationId: specializations[0].id },
      { doctorId: doctor.id, specializationId: specializations[1].id },
    ]);

    const patient = await User.create({
      email: 'patient@mail.ru',
      password: await bcrypt.hash('Patient123', 10),
      name: 'АннаСидорова',
      role: 'patient',
    });

    const doctor2 = await User.create({
      email: 'doctor2@mail.ru',
      password: await bcrypt.hash('Doctor123', 10),
      name: 'МарияИванова',
      role: 'doctor',
    });

    await DoctorProfile.create({
      userId: doctor2.id,
      about: 'Невролог, кандидат медицинских наук. Консультации очно и онлайн.',
      photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400',
      price: 3500,
      rating: 4.7,
      contacts: 'maria.ivanova@mail.ru',
      visitFormats: ['online'],
    });

    await DoctorSpecialization.bulkCreate([
      { doctorId: doctor2.id, specializationId: specializations[2].id },
    ]);

    await Appointment.create({
      patientId: patient.id,
      doctorId: doctor.id,
      date: '2026-06-15',
      time: '10:00',
      format: 'in_person',
      comment: 'Плановый осмотр, жалобы на головную боль.',
      status: 'pending',
    });

    await Appointment.create({
      patientId: patient.id,
      doctorId: doctor2.id,
      date: '2026-05-20',
      time: '14:30',
      format: 'online',
      comment: 'Консультация по результатам анализов.',
      status: 'confirmed',
    });

    console.log('Seed completed.');
    console.log('Doctor: doctor@mail.ru / Doctor123');
    console.log('Patient: patient@mail.ru / Patient123');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
}

seed();
