const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Balance = require('./models/Balance');

async function seed() {
  const existingAdmin = await User.findOne({ username: 'lightspeed' });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash('Thunes2020!', 10);
    const admin = await User.create({
      username: 'lightspeed',
      passwordHash,
      role: 'admin',
    });
    await Balance.create({ userId: admin._id, amount: 10000 });
    console.log('Admin seeded: lightspeed / Thunes2020!');
  } else {
    console.log('Admin already exists, skipping seed.');
  }
}

module.exports = seed;
