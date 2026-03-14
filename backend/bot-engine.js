const Trade = require('./database/models/Trade');
const Balance = require('./database/models/Balance');

let simSettings = {
  winProbability: 0.55,
  payoutRatio: 0.85,
  marketVolatility: 0.5,
  startingBalance: 10000,
};

const runningBots = new Map();

function generatePriceTick(lastPrice, volatility) {
  const change = (Math.random() - 0.5) * 2 * volatility * lastPrice * 0.01;
  return Math.max(0.01, lastPrice + change);
}

function generatePriceHistory(length = 50) {
  const prices = [1000];
  for (let i = 1; i < length; i++) {
    prices.push(generatePriceTick(prices[i - 1], simSettings.marketVolatility));
  }
  return prices;
}

async function executeTrade(userId, botId, stake, direction) {
  const random = Math.random();
  const win = random < simSettings.winProbability;
  const result = win ? 'win' : 'loss';
  const profitLoss = win ? stake * simSettings.payoutRatio : -stake;

  const balance = await Balance.findOne({ userId });
  if (!balance) throw new Error('Balance not found');

  if (balance.amount < stake) throw new Error('Insufficient balance');

  balance.amount = parseFloat((balance.amount + profitLoss).toFixed(2));
  await balance.save();

  const trade = await Trade.create({
    botId: botId || null,
    userId,
    stake,
    direction,
    result,
    profitLoss,
  });

  return { trade, newBalance: balance.amount };
}

function startBot(userId, botId, params, onTrade) {
  if (runningBots.has(String(botId))) return false;

  const interval = setInterval(async () => {
    try {
      const { trade, newBalance } = await executeTrade(userId, botId, params.stake, params.direction);
      onTrade({ trade, newBalance });
    } catch (err) {
      console.error('Bot trade error:', err.message);
      stopBot(botId);
    }
  }, (params.duration || 5) * 1000);

  runningBots.set(String(botId), interval);
  return true;
}

function stopBot(botId) {
  const interval = runningBots.get(String(botId));
  if (interval) {
    clearInterval(interval);
    runningBots.delete(String(botId));
    return true;
  }
  return false;
}

function isBotRunning(botId) {
  return runningBots.has(String(botId));
}

function getSettings() {
  return { ...simSettings };
}

function updateSettings(updates) {
  simSettings = { ...simSettings, ...updates };
  return simSettings;
}

module.exports = {
  executeTrade,
  startBot,
  stopBot,
  isBotRunning,
  getSettings,
  updateSettings,
  generatePriceHistory,
};
