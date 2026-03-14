const bcrypt = require('bcryptjs');

if (!global._dpStore) {
  global._dpStore = {
    users: [],
    balances: [],
    bots: [],
    trades: [],
    _idCounter: 1,
    seeded: false,
    settings: {
      winProbability: 0.55,
      payoutRatio: 0.85,
      marketVolatility: 0.5,
      startingBalance: 10000,
    },
  };
}

const store = global._dpStore;

function nextId() {
  return String(store._idCounter++);
}

async function ensureSeeded() {
  if (store.seeded) return;
  const existing = store.users.find((u) => u.username === 'lightspeed');
  if (!existing) {
    const passwordHash = await bcrypt.hash('Thunes2020!', 10);
    const admin = {
      _id: nextId(),
      username: 'lightspeed',
      passwordHash,
      role: 'admin',
      createdAt: new Date(),
    };
    store.users.push(admin);
    store.balances.push({ _id: nextId(), userId: admin._id, amount: 10000 });
  }
  store.seeded = true;
}

module.exports = { store, nextId, ensureSeeded };
