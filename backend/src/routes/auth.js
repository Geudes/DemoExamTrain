const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, RefreshToken } = require('../models');
const { authMiddleware } = require('../middleware/auth');
const { userToResponse } = require('../utils/helpers');

const router = express.Router();

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'access-secret-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh-secret-change-in-production';
const ACCESS_EXPIRES = process.env.JWT_ACCESS_EXPIRES || '15m';
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES || '7d';

function createAccessToken(userId) {
  return jwt.sign({ userId }, JWT_ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES });
}

function createRefreshToken(userId) {
  return jwt.sign({ userId }, JWT_REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES });
}

function getRefreshTokenFromRequest(req) {
  if (req.body?.refreshToken) return req.body.refreshToken;
  if (req.query?.refreshToken) return req.query.refreshToken;
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) return authHeader.slice(7);
  return null;
}

async function issueTokens(user) {
  const accessToken = createAccessToken(user.id);
  const refreshToken = createRefreshToken(user.id);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);
  await RefreshToken.create({ token: refreshToken, userId: user.id, expiresAt });
  return { accessToken, refreshToken };
}

router.post('/register', async (req, res) => {
  try {
    const { email, password, name, role } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, name and password are required' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const normalizedName = String(name).trim();
    const userRole = role === 'teacher' ? 'teacher' : 'student';

    if (normalizedName.length < 5 || normalizedName.length > 15) {
      return res.status(400).json({ error: 'Name must be between 5 and 15 characters' });
    }
    if (String(password).length < 6 || String(password).length > 10) {
      return res.status(400).json({ error: 'Password must be between 6 and 10 characters' });
    }

    const existing = await User.findOne({ where: { email: normalizedEmail } });
    if (existing) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email: normalizedEmail,
      password: hashedPassword,
      name: normalizedName,
      role: userRole,
    });

    const { accessToken, refreshToken } = await issueTokens(user);
    res.status(201).json({
      accessToken,
      refreshToken,
      user: await userToResponse(user),
    });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ where: { email: String(email).trim().toLowerCase() } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const { accessToken, refreshToken } = await issueTokens(user);
    res.json({
      accessToken,
      refreshToken,
      user: await userToResponse(user),
    });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Login failed' });
  }
});

async function refreshHandler(req, res) {
  try {
    const refreshToken = getRefreshTokenFromRequest(req);
    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token is required' });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    } catch {
      return res.status(401).json({ error: 'Invalid or expired refresh token' });
    }

    const record = await RefreshToken.findOne({
      where: { token: refreshToken, userId: decoded.userId },
    });
    if (!record) {
      return res.status(401).json({ error: 'Refresh token revoked or invalid' });
    }
    if (new Date() > record.expiresAt) {
      await record.destroy();
      return res.status(401).json({ error: 'Refresh token expired' });
    }

    const accessToken = createAccessToken(decoded.userId);
    res.json({ accessToken, refreshToken });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Refresh failed' });
  }
}

router.get('/refresh', refreshHandler);
router.post('/refresh', refreshHandler);

router.post('/logout', authMiddleware, async (req, res) => {
  try {
    await RefreshToken.destroy({ where: { userId: req.user.id } });
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Logout failed' });
  }
});

module.exports = router;
