require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const apartmentsRoutes = require('./routes/apartments');
const bookingsRoutes = require('./routes/bookings');

const app = express();
const PORT = process.env.PORT || 3020;

app.use(cors({ origin: true, credentials: true }));
app.use(morgan('combined'));
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/apartments', apartmentsRoutes);
app.use('/bookings', bookingsRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/', (req, res) => {
  res.json({
    message: 'HomeRent API',
    endpoints: {
      auth: 'POST /auth/register, POST /auth/login, GET|POST /auth/refresh, POST /auth/logout',
      profile: 'GET|PUT /profile/me, DELETE /profile/:id',
      apartments: 'GET /apartments, GET /apartments/:id, POST|PUT|DELETE /apartments/:id',
      bookings: 'GET|POST /bookings, PATCH /bookings/:id',
    },
  });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

async function start() {
  try {
    await sequelize.authenticate();
    console.log('Database connected');
    app.listen(PORT, () => {
      console.log(`HomeRent API is running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Unable to start server:', err);
    process.exit(1);
  }
}

start();
