Team Task Manager (Ledger)
==========================

Full-stack app: React (Vite) + Express + PostgreSQL (Prisma). Users sign up, create projects, invite teammates by email, and manage tasks with Admin vs Member roles.

Local development
-----------------
Requirements: Node.js 20+, PostgreSQL (local or Docker).

1) Create backend/.env from backend/.env.example and set DATABASE_URL and JWT_SECRET.

2) From the repo root:
   npm install
   cd backend && npx prisma migrate dev && cd ..
   npm run dev

   (migrate dev creates/applies the database; in CI/production use: npm run db:migrate -w backend)

3) Open http://localhost:5173 (Vite proxies /api to the API on port 4000).

Production build (single origin)
--------------------------------
From repo root:
  npm install
  npm run build
  NODE_ENV=production npm start

The API serves the Vite build from frontend/dist when NODE_ENV=production.

Railway deployment (single project — frontend + backend)
--------------------------------------------------------
1) Push this repo to GitHub.

2) railway.app → New Project → Deploy from GitHub repo (this repository).

3) Add PostgreSQL to the same project (New → Database → PostgreSQL).

4) Add / open the Web Service → Settings:
   - Root Directory: leave EMPTY (repository root, not backend/)
   - Builder: Nixpacks (uses /nixpacks.toml at repo root)

5) Web Service → Variables (required):
   - DATABASE_URL  = copy from PostgreSQL service (Reference variable)
   - JWT_SECRET    = long random string (32+ characters)
   - NODE_ENV      = production

6) Deploy. Build installs backend + frontend, builds UI into backend/public,
   compiles API to backend/dist. Start runs prisma migrate deploy then node.

7) Verify: https://YOUR-APP.up.railway.app/api/health → {"ok":true}
   Open the same URL in a browser for the React app (no separate frontend URL).

Local production test (optional):
  cd backend && npm run build && set NODE_ENV=production && npm start
  Open http://localhost:4000

Role rules (summary)
--------------------
- Admin: edit/delete project, manage members and roles, full task control, delete any task.
- Member: create tasks; assign only self; edit tasks they created or are assigned to; cannot reassign to others; cannot manage members or project settings.

Submission checklist
--------------------
[ ] Live URL works (signup, login, projects, tasks)
[ ] GitHub repo is public or shared with reviewers
[ ] README.txt updated with your URLs
[ ] Demo video uploaded per assignment portal
