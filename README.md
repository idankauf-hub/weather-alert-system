# 🌦️ Weather Alerts Demo

A full-stack demo app for creating **personal weather alerts**.  
Built with **NestJS + MongoDB + Redis + BullMQ + React + Vite + React Query**.  

Users can register/login, add alerts (by city or coordinates), and see when their alert conditions are triggered — with background scanning powered by BullMQ.

---

## ✨ Features

- 🔑 JWT auth (register / login)
- 🌍 Fetch realtime weather data from [Tomorrow.io](https://www.tomorrow.io/)
- 📡 Alerts:
  - Save by **city** or **lat/lon**
  - Parameters: temperature / wind speed / precipitation
  - Operators: `>`, `>=`, `<`, `<=`, `=`
  - Threshold value
- 📊 Alert evaluation:
  - Automatic background scanning (via BullMQ + Redis)
  - One-click evaluation from the UI
- 🖥️ Frontend UI (React + MUI + React Query)
  - Create alerts
  - See saved alerts (per user)
  - See current triggered states
  - Snackbar feedback + inline indicators

---

## 🛠️ Tech Stack

- **Backend**: NestJS, Mongoose, BullMQ, JWT Auth
- **Frontend**: React, Vite, React Query, Material UI
- **Infra**: Docker Compose (MongoDB, Redis, Backend, Frontend)

---

## ⚙️ Setup

### 1. Clone the repo

```bash
git clone https://github.com/idankauf-hub/weather-alert-system
cd Weather
````

### 2. Environment Variables

Copy `.env.example` to `.env` (or create manually):

```bash
# ===== Backend =====
MONGO_URI=mongodb://mongo:27017/weather
REDIS_URL=redis://redis:6379

# REQUIRED: Tomorrow.io API key
# Sign up at https://www.tomorrow.io/ to get a free key
TOMORROW_API_KEY=your-api-key-here

# Background scanning (optional overrides)
ALERT_SCAN_CRON=*/5 * * * *    # run scan every 5 minutes (UTC)
ALERT_SCAN_EVERY_MS=60000      # OR every 60s, overrides cron if set

# JWT (auth)
# These defaults will work as-is, but you may change if needed
JWT_SECRET=super-secret
JWT_EXPIRES_IN=7d

# ===== Frontend =====
VITE_API_BASE=http://backend:3000

```

**Required: only TOMORROW_API_KEY must be replaced with a real value.
All others have safe defaults — you can leave them as-is unless you want to customize.**

---

## ▶️ Run Locally

### With Docker (recommended)

```bash
docker compose up --build
```

Services exposed:

* Backend: [http://localhost:3000](http://localhost:3000)
* Frontend: [http://localhost:5173](http://localhost:5173)

### Without Docker

Run services manually:

```bash
# Terminal 1 — Mongo
docker run -p 27017:27017 mongo:7

# Terminal 2 — Redis
docker run -p 6379:6379 redis:7

# Terminal 3 — Backend
cd apps/backend
npm install
npm run start:dev

# Terminal 4 — Frontend
cd apps/frontend
npm install
npm run dev
```

---

## 📚 API Overview

* `POST /auth/register` `{ email }` → register
* `POST /auth/login` `{ email }` → login
* `GET /weather?city=tel aviv` → realtime weather
* `POST /alerts` → create alert
* `GET /alerts` → list alerts
* `DELETE /alerts/:id` → delete alert
* `POST /alerts/:id/evaluate` → manually check one alert
* `GET /states/current` → list current triggered alerts

All requests except `/auth/*` require `Authorization: Bearer <token>`.

---

## 👩‍💻 Frontend

* Login / Register (no-password demo by email)
* Alerts page:

  * Create new alert
  * List existing alerts
  * Trigger evaluation
  * Delete
* Current state page:
  * View currently triggered alerts
  * Refresh to fetch latest triggered state

---

## 🚧 Notes / Limitations

* Alerts run background evaluation every `ALERT_SCAN_CRON` or `ALERT_SCAN_EVERY_MS`.
* For invalid city names, the backend rejects creation with `400 Invalid location`.
* No email notifications — only in-app triggered state.
* Only basic auth.

---

## 🧪 Quick Test

1. Register (`/signin` on UI).
2. Add an alert (`temperature gt 30` for `Tel Aviv`).
3. Wait for scan.
4. Go to "Current State" page → see if triggered.
