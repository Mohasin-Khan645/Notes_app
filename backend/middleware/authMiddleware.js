const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Check Authorization Header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Isolate token
      token = req.headers.authorization.split(' ')[1];

      // Decode token using JWT_SECRET (with dynamic fallback if env is unset)
      const secret = process.env.JWT_SECRET || 'NEURAL_VAULT_COGNITIVE_KEY_3.8';
      const decoded = jwt.verify(token, secret);

      // Fetch user node context and append to request pipeline (omit password hashes)
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({ error: 'Uplink credentials expired or revoked' });
      }

      next();
    } catch (err) {
      console.error('[AuthMiddleware] Handshake verification breach:', err.message);
      return res.status(401).json({ error: 'Identity handshake failed. Access denied.' });
    }
  }

  if (!token) {
    return res.status(401).json({ error: 'Security credentials signature missing. Access denied.' });
  }
};

module.exports = { protect };
