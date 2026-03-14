const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Dollar Printer API is running' });
});

app.get('/api/stats', (req, res) => {
  res.json({
    totalRevenue: 124530.75,
    totalOrders: 3842,
    activeUsers: 1247,
    conversionRate: 3.8,
    revenueChange: 12.4,
    ordersChange: 8.2,
    usersChange: 5.1,
    conversionChange: -0.3,
  });
});

app.get('/api/revenue', (req, res) => {
  const data = [
    { month: 'Jan', revenue: 8200 },
    { month: 'Feb', revenue: 9400 },
    { month: 'Mar', revenue: 7800 },
    { month: 'Apr', revenue: 11200 },
    { month: 'May', revenue: 10500 },
    { month: 'Jun', revenue: 13400 },
    { month: 'Jul', revenue: 12800 },
    { month: 'Aug', revenue: 14200 },
    { month: 'Sep', revenue: 15600 },
    { month: 'Oct', revenue: 13900 },
    { month: 'Nov', revenue: 16800 },
    { month: 'Dec', revenue: 17730 },
  ];
  res.json(data);
});

app.get('/api/orders', (req, res) => {
  const orders = [
    { id: 'ORD-001', customer: 'Alice Johnson', amount: 340.00, status: 'Completed', date: '2026-03-10' },
    { id: 'ORD-002', customer: 'Bob Martinez', amount: 125.50, status: 'Processing', date: '2026-03-11' },
    { id: 'ORD-003', customer: 'Carol White', amount: 890.00, status: 'Completed', date: '2026-03-12' },
    { id: 'ORD-004', customer: 'David Lee', amount: 45.99, status: 'Pending', date: '2026-03-13' },
    { id: 'ORD-005', customer: 'Eva Chen', amount: 670.25, status: 'Completed', date: '2026-03-13' },
    { id: 'ORD-006', customer: 'Frank Brown', amount: 215.00, status: 'Processing', date: '2026-03-14' },
    { id: 'ORD-007', customer: 'Grace Kim', amount: 1200.00, status: 'Completed', date: '2026-03-14' },
  ];
  res.json(orders);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Dollar Printer dashboard running on port ${PORT}`);
});
