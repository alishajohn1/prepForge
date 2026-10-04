# 🚀 Deploying PrepForge — 100% Free

| Part | Host | Free tier | Card needed? |
|------|------|-----------|--------------|
| Database | **Neon** (Postgres) | 0.5 GB storage, scales to zero | No |
| Backend API | **Vercel** (serverless) — *or Render* | Hobby plan | No |
| Frontend | **Vercel** | Hobby plan | No |
| Code | **GitHub** | Free | No |

Total cost: **₹0 / $0**. Takes about 15 minutes.

> Why Vercel for the backend? Render's free tier sleeps after 15 min idle and takes
> ~50 s to wake. Vercel serverless functions wake in ~1 s. Render is documented below
> as an alternative.

---

## 0. Prerequisites

- A GitHub account, with this project pushed to a repo:
  ```bash
  git init
  git add .
  git commit -m "Initial commit"
  git branch -M main
  git remote add origin https://github.com/<you>/prepForge.git
  git push -u origin main
  ```
- Node.js 18+ installed locally (only needed once, to set up the database).

---

## 1. Database — Neon

1. Sign up at **https://neon.tech** (GitHub login works).
2. **Create project** → name `prepforge` → pick the region nearest you
   (e.g. *AWS Asia Pacific (Singapore)* for India).
3. On the dashboard click **Connect** and copy the connection string. It looks like:
   ```
   postgresql://neondb_owner:xxxx@ep-xxxx-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
   ```
   ✅ Use the **pooled** connection string (host contains `-pooler`) — it's best for serverless.
4. Create the tables and load the 180 problems **from your machine**:
   ```bash
   cd backend
   cp .env.example .env        # then paste your Neon URL into DATABASE_URL
   npm install
   npm run db:setup            # = migrate + seed
   ```
   You should see `✅ Migrations completed` and `✅ Seeded 180 problems`.

   The seed is safe to re-run: it skips if problems already exist.
   (`npm run seed -- --force` wipes and re-seeds, **deleting all user progress**.)

---

## 2. Backend — Vercel

1. Generate a JWT secret and keep it handy:
   ```bash
   node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
   ```
2. Go to **https://vercel.com** → sign in with GitHub → **Add New… → Project** → import your repo.
3. Configure:
   - **Project name:** `prepforge-api`
   - **Root Directory:** `backend` ← important
   - Framework Preset: *Other* (leave build settings empty; `backend/vercel.json` handles it)
4. **Environment Variables:**

   | Key | Value |
   |-----|-------|
   | `DATABASE_URL` | your Neon pooled connection string |
   | `JWT_SECRET` | the secret from step 1 |
   | `NODE_ENV` | `production` |
   | `FRONTEND_URL` | `http://localhost:3000` (temporary — updated in step 4) |

5. **Deploy.** Then open `https://prepforge-api.vercel.app/health` (your URL may differ) —
   you should see `{"status":"OK",...}`.

---

## 3. Frontend — Vercel

1. Vercel → **Add New… → Project** → import the **same** repo again.
2. Configure:
   - **Project name:** `prepforge`
   - **Root Directory:** `frontend`
   - Framework: *Next.js* (auto-detected)
3. **Environment Variables:**

   | Key | Value |
   |-----|-------|
   | `NEXT_PUBLIC_API_URL` | your backend URL, e.g. `https://prepforge-api.vercel.app` (no trailing slash) |

4. **Deploy.** You'll get a URL like `https://prepforge.vercel.app`.

> `NEXT_PUBLIC_*` values are baked in at build time. If you change it later,
> **redeploy** the frontend (Deployments → ⋯ → Redeploy).

---

## 4. Connect them (CORS)

1. Open the **backend** project on Vercel → Settings → Environment Variables.
2. Set `FRONTEND_URL` to your frontend URL, e.g. `https://prepforge.vercel.app`.
   - Several origins? Comma-separate them: `https://prepforge.vercel.app,http://localhost:3000`
   - Want Vercel preview deployments to work too? Add `ALLOW_VERCEL_PREVIEWS` = `true`.
3. Deployments → latest → ⋯ → **Redeploy**.

Open the frontend, register an account, and mark a problem solved. Done 🎉

From now on, every `git push` to `main` redeploys both projects automatically.

---

## Alternative: backend on Render (instead of step 2)

Use this if you prefer an always-on Node server over serverless functions.

1. Sign up at **https://render.com** with GitHub (no card needed for free web services).
2. **New → Blueprint** → select your repo. Render reads `render.yaml`.
3. When prompted, fill in `DATABASE_URL` (Neon) and `FRONTEND_URL`. `JWT_SECRET` is auto-generated.
4. Deploy. The start command runs `npm run db:setup` automatically, so step 1.4 is optional here.
5. Your API is at `https://prepforge-api.onrender.com` → use that as `NEXT_PUBLIC_API_URL`.

**Free-tier caveat:** the service sleeps after 15 minutes idle; the first request then
takes ~50 s. The frontend shows a "server may be waking up" message if that happens.
To keep it awake, add a free monitor at **https://uptimerobot.com** pinging
`https://prepforge-api.onrender.com/health` every 5 minutes.

---

## Run locally

**Without Docker** (uses Neon or any Postgres):
```bash
cd backend  && cp .env.example .env && npm install && npm run db:setup && npm run dev
cd frontend && cp .env.example .env.local && npm install && npm run dev
```

**With Docker** (bundled local Postgres — no Neon needed):
```bash
docker compose up --build
```
Frontend → http://localhost:3000, API → http://localhost:5000

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Browser console shows a **CORS** error | `FRONTEND_URL` on the backend must exactly match the frontend origin (`https://…`, no trailing slash). Redeploy the backend after changing it. |
| Frontend calls `localhost:5000` in production | `NEXT_PUBLIC_API_URL` wasn't set when the frontend was built → set it and redeploy. |
| `Missing required environment variables` in logs | Add `DATABASE_URL` / `JWT_SECRET` to the backend project. |
| Sheet page is empty | Database wasn't seeded → run `npm run db:setup` locally against the Neon URL. |
| `relation "users" does not exist` | Same as above — migrations haven't run. |
| First request slow (Render only) | Free instance waking up; see the UptimeRobot tip above. |
