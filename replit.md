# Dollar Printer Dashboard

A revenue and orders dashboard built with Express and vanilla HTML/JS.

## Architecture

- **Backend**: Express.js server (`server.js`) on port 5000
- **Frontend**: Vanilla HTML/CSS/JS served as static files from `public/`
- **Runtime**: Node.js 20

## Project Structure

```
├── server.js        # Express server — serves API + static files
├── public/
│   └── index.html   # Dashboard frontend (HTML/CSS/JS)
├── package.json
└── replit.md
```

## Running

```bash
node server.js
```

The server starts on port 5000 (configured via `PORT` env var).

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/health | Health check |
| GET | /api/stats | Dashboard KPI stats |
| GET | /api/revenue | Monthly revenue chart data |
| GET | /api/orders | Recent orders list |

## Deployment

Configured for autoscale deployment. Run command: `node server.js`
