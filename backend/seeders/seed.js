require('dotenv').config();
const bcrypt = require('bcryptjs');
const {
  sequelize,
  User,
  TrainerProfile,
  Specialization,
  TrainerSpecialization,
} = require('../src/models');

async function seed() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });

    const specializations = await Promise.all([
      Specialization.create({ name: 'Йога' }),
      Specialization.create({ name: 'Кроссфит' }),
      Specialization.create({ name: 'Пилатес' }),
      Specialization.create({ name: 'Бокс' }),
      Specialization.create({ name: 'Стретчинг' }),
    ]);

    const trainer = await User.create({
      email: 'trainer@mail.ru',
      password: await bcrypt.hash('Trainer123', 10),
      name: 'ИванТренер',
      role: 'trainer',
    });

    await TrainerProfile.create({
      userId: trainer.id,
      about: 'Персональный тренер с 8-летним опытом. Помогаю достигать целей в комфортном темпе.',
      photo: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400',
      price: 2500,
      rating: 4.9,
      contacts: '+7 (999) 123-45-67',
      clientLevels: ['beginner', 'advanced', 'online'],
    });

    await TrainerSpecialization.bulkCreate([
      { trainerId: trainer.id, specializationId: specializations[0].id },
      { trainerId: trainer.id, specializationId: specializations[2].id },
    ]);

    const client = await User.create({
      email: 'client@mail.ru',
      password: await bcrypt.hash('NewClient123', 10),
      name: 'АннаКлиент',
      role: 'client',
    });

    const trainer2 = await User.create({
      email: 'trainer2@mail.ru',
      password: await bcrypt.hash('Trainer123', 10),
      name: 'МарияСпорт',
      role: 'trainer',
    });

    await TrainerProfile.create({
      userId: trainer2.id,
      about: 'Специалист по функциональным тренировкам и боксу.',
      photo: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400',
      price: 3000,
      rating: 4.7,
      contacts: 'maria.sport@mail.ru',
      clientLevels: ['advanced', 'professional'],
    });

    await TrainerSpecialization.bulkCreate([
      { trainerId: trainer2.id, specializationId: specializations[1].id },
      { trainerId: trainer2.id, specializationId: specializations[3].id },
    ]);

    console.log('Seed completed.');
    console.log('Trainer: trainer@mail.ru / Trainer123');
    console.log('Client: client@mail.ru / NewClient123');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
}

seed();
