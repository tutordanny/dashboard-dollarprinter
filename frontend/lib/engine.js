const { store, nextId } = require('./store');

function generatePriceTick(lastPrice, volatility) {
  const change = (Math.random() - 0.5) * 2 * volatility * lastPrice * 0.01;
  return Math.max(0.01, lastPrice + change);
}

function generatePriceHistory(length = 50) {
  const prices = [1000];
  for (let i = 1; i < length; i++) {
    prices.push(generatePriceTick(prices[i - 1], store.settings.marketVolatility));
  }
  return prices;
}

function executeTrade(userId, botId, stake, direction) {
  const win = Math.random() < store.settings.winProbability;
  const result = win ? 'win' : 'loss';
  const profitLoss = win
    ? parseFloat((stake * store.settings.payoutRatio).toFixed(2))
    : -stake;

  const balance = store.balances.find((b) => b.userId === userId);
  if (!balance) throw new Error('Balance not found');
  if (balance.amount < stake) throw new Error('Insufficient balance');

  balance.amount = parseFloat((balance.amount + profitLoss).toFixed(2));

  const trade = {
    _id: nextId(),
    botId: botId || null,
    userId,
    stake,
    direction,
    result,
    profitLoss,
    timestamp: new Date(),
  };
  store.trades.push(trade);

  return { trade, newBalance: balance.amount };
}

function getSettings() {
  return { ...store.settings };
}

function updateSettings(updates) {
  const { winProbability, payoutRatio, marketVolatility, startingBalance } = updates;
  if (winProbability !== undefined) store.settings.winProbability = winProbability;
  if (payoutRatio !== undefined) store.settings.payoutRatio = payoutRatio;
  if (marketVolatility !== undefined) store.settings.marketVolatility = marketVolatility;
  if (startingBalance !== undefined) store.settings.startingBalance = startingBalance;
  return getSettings();
}

module.exports = { executeTrade, generatePriceHistory, getSettings, updateSettings };
