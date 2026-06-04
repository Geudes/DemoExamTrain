require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const trainersRoutes = require('./routes/trainers');
const bookingsRoutes = require('./routes/bookings');
const specializationsRoutes = require('./routes/specializations');

const app = express();
const PORT = process.env.PORT || 3010;

app.use(cors({ origin: true, credentials: true }));
app.use(morgan('combined'));
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/trainers', trainersRoutes);
app.use('/bookings', bookingsRoutes);
app.use('/specializations', specializationsRoutes);
app.use('/specialization', specializationsRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/', (req, res) => {
  res.json({
    message: 'SportTrainer API',
    endpoints: {
      auth: 'POST /auth/register, POST /auth/login, GET|POST /auth/refresh, POST /auth/logout',
      profile: 'GET|PUT /profile/me, DELETE /profile/:id',
      trainers: 'GET /trainers, GET /trainers/:id',
      bookings: 'GET|POST /bookings, PATCH /bookings/:id',
      specializations: 'GET|POST /specializations, POST|DELETE /specialization/selected',
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
      console.log(`SportTrainer API is running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Unable to start server:', err);
    process.exit(1);
  }
}

start();
