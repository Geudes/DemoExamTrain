require('dotenv').config();
const bcrypt = require('bcryptjs');
const {
  sequelize,
  User,
  OwnerProfile,
  Apartment,
  Booking,
} = require('../src/models');

async function seed() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });

    const owner = await User.create({
      email: 'owner@mail.ru',
      password: await bcrypt.hash('Owner123', 10),
      name: 'ИванВладелец',
      role: 'owner',
    });

    await OwnerProfile.create({
      userId: owner.id,
      phone: '+7 (999) 111-22-33',
      description: 'Сдаю уютное жильё в центре города уже 5 лет.',
      avatar: 'https://images.newscientist.com/wp-content/uploads/2025/10/22103513/SEI_270442304.jpg',
    });

    const tenant = await User.create({
      email: 'tenant@mail.ru',
      password: await bcrypt.hash('Tenant123', 10),
      name: 'АннаАрендатор',
      role: 'tenant',
    });

    const apartments = await Apartment.bulkCreate([
      {
        ownerId: owner.id,
        title: 'Светлая квартира у метро',
        type: 'apartment',
        city: 'Москва',
        address: 'ул. Тверская, 12',
        description: 'Просторная двухкомнатная квартира в 5 минутах от метро. Полностью меблирована, есть всё для комфортного проживания.',
        shortDescription: 'Двухкомнатная квартира рядом с метро',
        pricePerNight: 4500,
        rooms: 2,
        maxGuests: 4,
        amenities: ['Wi-Fi', 'Кухня', 'Стиральная машина', 'Кондиционер'],
        photos: [
          'https://images.newscientist.com/wp-content/uploads/2025/10/22103513/SEI_270442304.jpg',
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTo0mWP_wHuSdDpMVD_rmfD9CDljsqa5IdH_J5u1x3mWNuk-k-6SF6QV4-s&s=10',
        ],
        published: true,
        rating: 4.8,
      },
      {
        ownerId: owner.id,
        title: 'Уютная студия в центре',
        type: 'studio',
        city: 'Москва',
        address: 'ул. Арбат, 5',
        description: 'Компактная студия для одного или пары. Идеально для краткосрочной аренды.',
        shortDescription: 'Студия в историческом центре',
        pricePerNight: 3200,
        rooms: 1,
        maxGuests: 2,
        amenities: ['Wi-Fi', 'Кухня', 'Телевизор'],
        photos: [
          'https://images.newscientist.com/wp-content/uploads/2025/10/22103513/SEI_270442304.jpg',
        ],
        published: true,
        rating: 4.5,
      },
      {
        ownerId: owner.id,
        title: 'Загородный дом с садом',
        type: 'house',
        city: 'Подмосковье',
        address: 'пос. Барвиха, ул. Лесная, 8',
        description: 'Просторный дом для семейного отдыха. Большой сад, терраса, камин.',
        shortDescription: 'Дом для отдыха на природе',
        pricePerNight: 12000,
        rooms: 4,
        maxGuests: 8,
        amenities: ['Wi-Fi', 'Парковка', 'Камин', 'Барбекю', 'Сад'],
        photos: [
          'https://images.newscientist.com/wp-content/uploads/2025/10/22103513/SEI_270442304.jpg',
        ],
        published: true,
        rating: 4.9,
      },
      {
        ownerId: owner.id,
        title: 'Комната в общежитии',
        type: 'room',
        city: 'Санкт-Петербург',
        address: 'Невский пр., 100',
        description: 'Недорогая комната для студентов и путешественников.',
        shortDescription: 'Бюджетная комната в центре СПб',
        pricePerNight: 1500,
        rooms: 1,
        maxGuests: 1,
        amenities: ['Wi-Fi', 'Общая кухня'],
        photos: [
          'https://images.newscientist.com/wp-content/uploads/2025/10/22103513/SEI_270442304.jpg',
        ],
        published: true,
        rating: 4.2,
      },
      {
        ownerId: owner.id,
        title: 'Черновик объявления',
        type: 'apartment',
        city: 'Казань',
        address: 'ул. Баумана, 1',
        description: 'Объявление в процессе подготовки.',
        shortDescription: 'Черновик',
        pricePerNight: 3000,
        rooms: 1,
        maxGuests: 2,
        amenities: ['Wi-Fi'],
        photos: [],
        published: false,
        rating: 0,
      },
    ]);

    await Booking.create({
      tenantId: tenant.id,
      apartmentId: apartments[0].id,
      checkIn: '2026-06-15',
      checkOut: '2026-06-20',
      guests: 2,
      comment: 'Приедем вечером, нужна парковка.',
      status: 'pending',
    });

    await Booking.create({
      tenantId: tenant.id,
      apartmentId: apartments[1].id,
      checkIn: '2026-05-01',
      checkOut: '2026-05-05',
      guests: 1,
      comment: 'Командировка.',
      status: 'confirmed',
    });

    console.log('Seed completed.');
    console.log('Owner: owner@mail.ru / Owner123');
    console.log('Tenant: tenant@mail.ru / Tenant123');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
}

seed();
