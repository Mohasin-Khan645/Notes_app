const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const noteRoutes = require('./routes/noteRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/neural_vault';

// 1. Cyber Logger Middleware
app.use((req, res, next) => {
  console.log(`[CONDUIT LOG] ${new Date().toISOString()} // INTERCEPT: ${req.method} -> ${req.url}`);
  next();
});

// 2. Middlewares
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json());

// 3. Mount REST APIs Router
app.use('/api/notes', noteRoutes);
app.use('/api/auth', authRoutes);

// Base route for server checking
app.get('/', (req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'NEURAL VAULT KNOWLEDGE MATRIX CORE',
    version: '3.8',
    diagnostics: 'ALL SYNPASES STABLE'
  });
});

// 4. Mongoose database hook
console.log('[VAULT DB] INITIATING DATABASE UPLINK PATHWAY...');
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('===================================================');
    console.log('  ✅ DATABASE CONNECTION SECURED IN STORAGE CORES');
    console.log(`  🔗 UPLINK: ${MONGODB_URI}`);
    console.log('===================================================');
  })
  .catch(err => {
    console.log('===================================================');
    console.log('  ❌ DATABASE UPLINK FAILURE: SYSTEM IN ISOLATION');
    console.log(`  🛑 ERROR LOG: ${err.message}`);
    console.log('===================================================');
  });

// 5. Start cyber-conduit listener
app.listen(PORT, () => {
  console.log('===================================================');
  console.log(`  🚀 NEURAL CONDUIT API ONLINE ON PORT: [${PORT}]`);
  console.log('  🧠 DEVBOT COGNITIVE SUB-LAYERS ACTIVATED');
  console.log('===================================================');
});
