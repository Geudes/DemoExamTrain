require('dotenv').config();
const bcrypt = require('bcryptjs');
const {
  sequelize,
  User,
  TeacherProfile,
  Instrument,
  TeacherInstrument,
} = require('../src/models');

async function seed() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });

    const instruments = await Promise.all([
      Instrument.create({ name: 'Гитара' }),
      Instrument.create({ name: 'Вокал' }),
      Instrument.create({ name: 'Фортепиано' }),
      Instrument.create({ name: 'Ударные' }),
      Instrument.create({ name: 'Скрипка' }),
    ]);

    const teacher = await User.create({
      email: 'teacher@mail.ru',
      password: await bcrypt.hash('Teacher123', 10),
      name: 'АлексейМузыка',
      role: 'teacher',
    });

    await TeacherProfile.create({
      userId: teacher.id,
      about: 'Преподаватель гитары и фортепиано с 8-летним стажем. Работаю с начинающими и продолжающими, помогаю поставить технику и разобрать любимые произведения.',
      photo: 'https://images.unsplash.com/photo-1511379938549-c8f198217bb1?w=400',
      price: 2000,
      rating: 4.9,
      contacts: '+7 (999) 123-45-67',
      studentLevels: ['beginner', 'advanced', 'online'],
    });

    await TeacherInstrument.bulkCreate([
      { teacherId: teacher.id, instrumentId: instruments[0].id },
      { teacherId: teacher.id, instrumentId: instruments[2].id },
    ]);

    const student = await User.create({
      email: 'student@mail.ru',
      password: await bcrypt.hash('NewStudent123', 10),
      name: 'ДмитрийУченик',
      role: 'student',
    });

    const teacher2 = await User.create({
      email: 'teacher2@mail.ru',
      password: await bcrypt.hash('Teacher123', 10),
      name: 'ЕленаВокал',
      role: 'teacher',
    });

    await TeacherProfile.create({
      userId: teacher2.id,
      about: 'Педагог по вокалу и сольфеджио. Готовлю к выступлениям и поступлению в музыкальные училища.',
      photo: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400',
      price: 2500,
      rating: 4.7,
      contacts: 'elena.vocal@mail.ru',
      studentLevels: ['advanced', 'professional'],
    });

    await TeacherInstrument.bulkCreate([
      { teacherId: teacher2.id, instrumentId: instruments[1].id },
      { teacherId: teacher2.id, instrumentId: instruments[4].id },
    ]);

    console.log('Seed completed.');
    console.log('Teacher: teacher@mail.ru / Teacher123');
    console.log('Student: student@mail.ru / NewStudent123');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
}

seed();
