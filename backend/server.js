require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const authRoutes = require('./routes/auth');
const botRoutes = require('./routes/bot');
const adminRoutes = require('./routes/admin');
const seed = require('./database/seed');

const app = express();
const PORT = process.env.BACKEND_PORT || 3001;

app.use(cors({ origin: '*' }));
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api', botRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

async function start() {
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
  console.log('MongoDB in-memory connected');
  await seed();
  app.listen(PORT, 'localhost', () => {
    console.log(`Backend API running on port ${PORT}`);
  });
}

start().catch(console.error);
