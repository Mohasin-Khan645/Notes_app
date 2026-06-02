const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Note = require('../models/Note');
const { protect } = require('../middleware/authMiddleware');

const JWT_SECRET = process.env.JWT_SECRET || 'NEURAL_VAULT_COGNITIVE_KEY_3.8';

// Helper: Signs Token
const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });
};

// 1. REGISTER NEW USER: POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All credential fields are mandatory for security profile creation' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ error: 'Identity credentials or email node already registered' });
    }

    // Create User (password gets hashed dynamically on schema pre-save hook)
    const user = await User.create({
      username,
      email,
      password
    });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id)
    });

  } catch (err) {
    res.status(500).json({ error: 'Failed to establish operator profile', details: err.message });
  }
});

// 2. LOGIN USER: POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Uplink credentials and decryption passwords are required' });
    }

    // Locate User by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid operator credentials' });
    }

    // Compare passwords cryptographically
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid decryption passcode' });
    }

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id)
    });

  } catch (err) {
    res.status(500).json({ error: 'Access matrix negotiation failure', details: err.message });
  }
});

// 3. RETRIEVE CURRENT USER PROFILE: GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  try {
    res.json(req.user);
  } catch (err) {
    res.status(500).json({ error: 'Identity matrix lookup failure', details: err.message });
  }
});

// 4. UPDATE USER PROFILE DETAILS: PUT /api/auth/profile
router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'Operator profile not found' });
    }

    const { username, email, password } = req.body;

    // Check username conflict
    if (username && username !== user.username) {
      const usernameExists = await User.findOne({ username });
      if (usernameExists) {
        return res.status(400).json({ error: 'Operator designation already registered' });
      }
      user.username = username;
    }

    // Check email conflict
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ error: 'Uplink email coordinate already registered' });
      }
      user.email = email;
    }

    // Hash password if modified
    if (password) {
      user.password = password; // Bcrypt auto-triggers pre-save hook
    }

    await user.save();

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      message: 'Operator configuration successfully recalibrated'
    });
  } catch (err) {
    res.status(500).json({ error: 'Configuration sync failure', details: err.message });
  }
});

// 5. PERMANENT ACCOUNT PURGE: DELETE /api/auth/profile
router.delete('/profile', protect, async (req, res) => {
  try {
    // 1. Wipe all notes belonging to the operator
    await Note.deleteMany({ user: req.user.id });

    // 2. Wipe user profile
    await User.findByIdAndDelete(req.user.id);

    res.json({ message: 'Operator account and neural vault successfully purged' });
  } catch (err) {
    res.status(500).json({ error: 'Purge operation critical failure', details: err.message });
  }
});

module.exports = router;
