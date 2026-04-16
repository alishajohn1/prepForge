# ⚡ PrepForge — DSA Tracking SaaS

> Striver Sheet–inspired DSA tracking SaaS with progress analytics, streak system, topic-wise performance insights, and revision mode.

---

## 🧠 What Is PrepForge?

PrepForge is a full-stack DSA (Data Structures & Algorithms) tracker built for serious interview prep. It features:

- **180 curated DSA problems** across 10 topics (Arrays, DP, Graphs, Trees, etc.)
- **Per-user progress tracking** — Solved / Pending / Revision
- **Topic-wise analytics** with charts and skill radar
- **GitHub-style activity heatmap**
- **Streak engine** — current streak, longest streak, daily goal
- **Revision mode** — dedicated queue for problems to revisit
- **Weak topic detection** — flags topics below 50% completion
- **Problem notes** — add personal notes per problem

---

## 🛠 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 14, React, Tailwind CSS, Recharts |
| Backend | Node.js, Express |
| Database | **Neon PostgreSQL** (serverless Postgres) |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| Charts | Recharts |
| Fonts | Syne + DM Sans + JetBrains Mono |

---

## 📁 Project Structure

```
prepforge/
├── backend/
│   ├── src/
│   │   ├── db/
│   │   │   ├── index.js        # Neon DB connection pool
│   │   │   └── migrate.js      # Schema migrations
│   │   ├── seeds/
│   │   │   └── seed.js         # 180 DSA problems seed data
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── problemController.js
│   │   │   └── analyticsController.js
│   │   ├── middleware/
│   │   │   └── auth.js         # JWT auth middleware
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── problems.js
│   │   │   └── analytics.js
│   │   └── index.js            # Express server
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── page.js           # Landing / Auth page
    │   │   ├── dashboard/page.js # Main dashboard
    │   │   ├── sheet/page.js     # DSA problem list
    │   │   ├── analytics/page.js # Charts & heatmap
    │   │   ├── revision/page.js  # Revision queue
    │   │   ├── streak/page.js    # Streak tracker
    │   │   ├── layout.js
    │   │   └── globals.css
    │   ├── components/
    │   │   ├── AppShell.js       # Authenticated layout
    │   │   └── Sidebar.js        # Navigation
    │   └── lib/
    │       ├── api.js            # API client
    │       └── auth-context.js   # React auth context
    ├── next.config.js
    ├── tailwind.config.js
    └── package.json
```

---

## 🚀 Setup Guide

### 1. Set Up Neon PostgreSQL

1. Go to [neon.tech](https://neon.tech) and create a free account
2. Create a new project — name it `prepforge`
3. Copy your **connection string** — it looks like:
   ```
   postgresql://user:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require
   ```

---

### 2. Backend Setup

```bash
cd backend
npm install

# Create .env from example
cp .env.example .env
```

Edit `.env`:
```env
DATABASE_URL=postgresql://user:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require
JWT_SECRET=your_super_secret_key_min_32_chars
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

Run migrations and seed:
```bash
npm run migrate    # Creates all tables + indexes
npm run seed       # Seeds 180 DSA problems
```

Start the server:
```bash
npm run dev        # Development with nodemon
npm start          # Production
```

Backend runs at: `http://localhost:5000`

---

### 3. Frontend Setup

```bash
cd frontend
npm install

# Create .env.local
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Start the dev server:
```bash
npm run dev
```

Frontend runs at: `http://localhost:3000`

---

## 🗄️ Database Schema

### `users`
| Column | Type | Notes |
|--------|------|-------|
| id | SERIAL PK | |
| username | VARCHAR(50) UNIQUE | |
| email | VARCHAR(255) UNIQUE | |
| password_hash | VARCHAR(255) | bcrypt |
| daily_goal | INTEGER | Default: 3 |

### `problems`
| Column | Type | Notes |
|--------|------|-------|
| id | SERIAL PK | |
| title | VARCHAR(255) | |
| topic | VARCHAR(100) | Arrays, DP, Graphs... |
| difficulty | VARCHAR(20) | Easy / Medium / Hard |
| link | VARCHAR(500) | LeetCode / GFG URL |
| platform | VARCHAR(50) | LeetCode / GeeksForGeeks |
| sheet_name | VARCHAR(100) | Top 180 DSA |
| order_index | INTEGER | Sort order |

### `user_problem_status`
| Column | Type | Notes |
|--------|------|-------|
| id | SERIAL PK | |
| user_id | INTEGER FK | → users |
| problem_id | INTEGER FK | → problems |
| status | VARCHAR(20) | SOLVED / PENDING / REVISION |
| notes | TEXT | Personal notes |
| last_updated | TIMESTAMP | |
| solved_at | TIMESTAMP | Set when SOLVED |

### `daily_activity`
| Column | Type | Notes |
|--------|------|-------|
| id | SERIAL PK | |
| user_id | INTEGER FK | → users |
| activity_date | DATE | |
| problems_solved | INTEGER | Incremented on solve |

---

## 🔌 API Reference

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login |
| GET | `/api/auth/me` | ✅ | Get current user |
| PATCH | `/api/auth/daily-goal` | ✅ | Update daily goal |

### Problems
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/problems` | ✅ | List problems (filterable) |
| GET | `/api/problems/topics` | ✅ | Get all topics |
| PATCH | `/api/problems/:id/status` | ✅ | Update status |

Query params for GET `/api/problems`: `topic`, `difficulty`, `status`, `search`, `page`, `limit`

### Analytics
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/analytics/dashboard` | ✅ | Full dashboard stats |
| GET | `/api/analytics/heatmap` | ✅ | Activity heatmap data |
| GET | `/api/analytics/weak-topics` | ✅ | Topics < 50% |
| GET | `/api/analytics/revision` | ✅ | Revision list |

---

## 📦 Deployment

### Backend → Railway / Render / Fly.io

1. Push code to GitHub
2. Connect repo to Railway/Render
3. Set environment variables from `.env`
4. Set start command: `npm start`
5. Run `npm run migrate` and `npm run seed` once

### Frontend → Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Set `NEXT_PUBLIC_API_URL` to your backend URL
4. Deploy!

---

## 🎯 Interview Impact

> "Built a Striver Sheet–inspired DSA tracking SaaS with progress analytics, streak system, and topic-wise performance insights using Next.js, Express, and Neon PostgreSQL."

Key talking points:
- **Full-stack**: Next.js 14 + Express REST API
- **Serverless DB**: Neon PostgreSQL with connection pooling
- **JWT Auth**: Stateless authentication
- **Analytics Engine**: Complex SQL with window functions for streak calculation
- **Scalable**: Multi-user SaaS architecture with user-scoped data

---

## 🧩 Topics Covered (180 Problems)

| Topic | Count |
|-------|-------|
| Arrays | 30 |
| Dynamic Programming | 25 |
| Trees | 20 |
| Graphs | 20 |
| Strings | 15 |
| Linked List | 15 |
| Binary Search | 10 |
| Stack & Queue | 10 |
| Heap | 10 |
| Backtracking | 10 |
| Tries | 5 |
| Bit Manipulation | 5 |
| Greedy | 5 |
| **Total** | **180** |

---

Made with 🔥 for serious DSA prep
