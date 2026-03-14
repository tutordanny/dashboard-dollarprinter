# Dollar Printer — Bot Simulation Platform

A full-stack private trading bot simulator with admin control panel.

## Architecture

- **Frontend**: Next.js 14 on port 5000 (served to users)
- **Backend**: Express.js API on port 3001 (internal)
- **Database**: MongoDB in-memory (via mongodb-memory-server, no setup needed)
- **Auth**: JWT tokens with admin/user roles

## Project Structure

```
├── frontend/               # Next.js app (port 5000)
│   ├── pages/
│   │   ├── index.js        # Main trading dashboard + login
│   │   ├── admin-login.js  # Admin login page
│   │   └── admin.js        # Admin control panel
│   ├── components/
│   │   ├── Sidebar.js
│   │   ├── TopBar.js
│   │   ├── ChartPanel.js
│   │   ├── BotBuilder.js
│   │   └── TradeLog.js
│   ├── utils/api.js        # Axios client
│   └── styles/globals.css
├── backend/                # Express API (port 3001)
│   ├── server.js
│   ├── bot-engine.js       # Simulation engine
│   ├── routes/
│   │   ├── auth.js
│   │   ├── bot.js
│   │   └── admin.js
│   └── database/
│       ├── models/         # Mongoose models
│       └── seed.js
└── package.json            # Root (concurrently)
```

## Routes

| Route | Description |
|-------|-------------|
| `/` | Main trading dashboard (login required) |
| `/admin-login` | Admin login page |
| `/admin` | Admin control panel (admin only) |

## Default Admin Credentials

- **Username**: `lightspeed`
- **Password**: `Thunes2020!`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/login | Login |
| POST | /api/register | Register |
| GET | /api/balance | Get user balance |
| GET | /api/trades | Get trade history |
| POST | /api/run-bot | Start bot |
| POST | /api/stop-bot | Stop bot |
| POST | /api/trade | Manual trade |
| GET | /api/price-history | Simulated price data |
| GET | /api/bot-status | Bot running status |
| GET | /api/admin/settings | Get sim settings (admin) |
| POST | /api/admin/update-settings | Update settings (admin) |
| GET | /api/admin/users | List users (admin) |
| POST | /api/admin/update-balance | Update user balance (admin) |
| GET | /api/admin/trades | All trades (admin) |
| GET | /api/admin/stats | Platform stats (admin) |

## Running

The workflow starts both services with concurrently:
- Backend: `node server.js` in `backend/`
- Frontend: `npm run dev` in `frontend/`

## Notes

- Database is in-memory: data resets on server restart
- Bot engine uses configurable win probability and payout ratio
- Admin can adjust win probability, payout ratio, and market volatility in real-time
