================================================================================
  ETHARA — TEAM TASK MANAGEMENT
  Full-stack assignment project (React + Express + PostgreSQL)
================================================================================

Ethara is a collaborative task manager for small teams. Users sign up, create
projects, invite teammates by email, and manage tasks on a Kanban-style board
with role-based permissions (Admin vs Member). A dashboard shows workspace
metrics, a task pipeline, and recent activity.

Live deployment uses a single Railway service: the Express API and the React UI
share one public URL (no separate frontend host).


--------------------------------------------------------------------------------
SUBMISSION LINKS (fill in before you submit)
--------------------------------------------------------------------------------

  Live application URL : _________________________________________________

  GitHub repository URL  : _________________________________________________

  Demo video URL         : _________________________________________________


--------------------------------------------------------------------------------
FEATURES
--------------------------------------------------------------------------------

  - User signup and login (JWT stored in the browser)
  - App-wide roles: Admin and Member
  - Projects with name, description, and color theme
  - Per-project membership and roles (invite existing users by email)
  - Tasks: title, description, status (Todo / In progress / Done), priority,
    due date, assignee
  - Kanban board, task register, team management, and dashboard summary
  - Demo seed: sample project, tasks, and a demo member account
  - Health check endpoint for deployment probes


--------------------------------------------------------------------------------
TECH STACK
--------------------------------------------------------------------------------

  Frontend   React 19, TypeScript, Vite, Tailwind CSS, Radix UI
  Backend    Express 5, TypeScript, Prisma ORM, PostgreSQL
  Auth       JWT (Bearer token), bcrypt password hashing
  Deploy     Railway (Nixpacks), single Web Service + PostgreSQL


--------------------------------------------------------------------------------
REPOSITORY STRUCTURE
--------------------------------------------------------------------------------

  ethara-assignment/
    README.txt           This file
    package.json         Root scripts (dev, build, start)
    nixpacks.toml        Railway build/install commands
    railway.toml         Railway health check and start command
    backend/
      src/server.ts      Express API + production static file serving
      prisma/            Schema and SQL migrations
      public/            Production UI build output (generated, gitignored)
      dist/              Compiled API (generated, gitignored)
      .env.example       Environment variable template
    frontend/
      src/               React application (App.tsx, components, API client)
      .env.example       Optional VITE_API_URL (usually leave empty)


--------------------------------------------------------------------------------
PREREQUISITES
--------------------------------------------------------------------------------

  - Node.js 20 or newer (22 used on Railway via nixpacks.toml)
  - npm (comes with Node)
  - PostgreSQL 14+ (local install, Docker, Neon, or Railway Postgres)


--------------------------------------------------------------------------------
LOCAL DEVELOPMENT
--------------------------------------------------------------------------------

1) Install dependencies (both packages)

     cd backend
     npm install
     cd ../frontend
     npm install

2) Configure the backend environment

     Copy backend/.env.example to backend/.env and set:

       DATABASE_URL   PostgreSQL connection string
                      Example: postgresql://user:pass@localhost:5432/ethara
       JWT_SECRET     Any long random string (32+ characters recommended)
       PORT           4000  (default; Vite proxies to this port)

     Optional for frontend (usually not needed locally):

       Copy frontend/.env.example to frontend/.env
       Leave VITE_API_URL empty so requests go to /api (proxied by Vite).

3) Apply database migrations

     cd backend
     npm run migrate:deploy

     For local schema changes during development you may use:

       npm run migrate:dev

4) Start the app (API + Vite dev server)

     From the repository root:

       npm run dev

     Or from backend only:

       cd backend
       npm run dev:all

5) Open the UI

     http://localhost:5173

     Vite proxies /api/* to http://localhost:4000.

6) Quick smoke test

     - Sign up as Admin
     - Click "Seed demo data" on the dashboard
     - Explore Board, Tasks, Team, and Dashboard tabs


--------------------------------------------------------------------------------
ENVIRONMENT VARIABLES
--------------------------------------------------------------------------------

  Backend (backend/.env)
  ----------------------
  DATABASE_URL   Required. PostgreSQL URL (include ?sslmode=require for Neon).
  JWT_SECRET     Required in production. Must not be the default placeholder.
  PORT           Optional. Defaults to 4000. Railway sets this automatically.
  NODE_ENV       Set to "production" on Railway.

  Frontend (frontend/.env)
  ------------------------
  VITE_API_URL   Leave empty for local dev and Railway single-service deploy.
                 The UI calls relative paths (/api/...). Only set this if the
                 API is on a different origin and you rebuild the frontend.

  Production safety
  -----------------
  If NODE_ENV=production, the server refuses to start without DATABASE_URL and
  a real JWT_SECRET (not "team-task-manager-secret").


--------------------------------------------------------------------------------
PRODUCTION BUILD (LOCAL TEST)
--------------------------------------------------------------------------------

  Builds the React app into backend/public and compiles the API to backend/dist.

    cd backend
    npm install
    cd ../frontend
    npm install
    cd ..
    npm run build

  Run migrations and start the combined server:

    cd backend
    set NODE_ENV=production
    npm start

  On macOS/Linux use:  export NODE_ENV=production

  Open:  http://localhost:4000

  Health:  http://localhost:4000/api/health  ->  {"ok":true}


--------------------------------------------------------------------------------
RAILWAY DEPLOYMENT (ONE PROJECT, ONE PUBLIC URL)
--------------------------------------------------------------------------------

Deploy from the repository ROOT. Do not set Root Directory to "backend/"
unless you intentionally use backend/railway.toml as a separate service.

Step 1 — Push code
  Push this repository to GitHub (or connect your Git provider).

Step 2 — Create Railway project
  https://railway.app  ->  New Project  ->  Deploy from GitHub repo

Step 3 — Add PostgreSQL
  In the same project:  New  ->  Database  ->  PostgreSQL

Step 4 — Configure the Web Service
  Settings:
    Root Directory     LEAVE EMPTY (repository root)
    Builder            Nixpacks (uses /nixpacks.toml)

  Variables (on the Web Service, not only Postgres):
    DATABASE_URL   Reference / copy from the PostgreSQL service
    JWT_SECRET     Long random string (32+ characters)
    NODE_ENV       production

  Do NOT set VITE_API_URL for the standard single-origin deploy.

Step 5 — Deploy
  Build installs backend + frontend, runs "cd backend && npm run build"
  (UI -> backend/public, API -> backend/dist).
  Start runs "prisma migrate deploy" then node dist/server.js.

Step 6 — Public URL
  Web Service  ->  Settings  ->  Networking  ->  Generate Domain

  Your live app:  https://YOUR-SERVICE.up.railway.app
  (NOT the *.railway.internal hostname — that is private to Railway.)

Step 7 — Verify
  https://YOUR-SERVICE.up.railway.app/api/health   ->  {"ok":true}
  Open the same base URL in a browser for the React app.


--------------------------------------------------------------------------------
ROOT NPM SCRIPTS
--------------------------------------------------------------------------------

  npm run dev          Start API (port 4000) + Vite (port 5173)
  npm run build        Production build (frontend + API)
  npm start            Migrate DB and run production server (from backend/)
  npm run db:migrate   Run prisma migrate deploy in backend/


--------------------------------------------------------------------------------
API OVERVIEW
--------------------------------------------------------------------------------

  Public
    GET   /api/health
    GET   /api/version
    POST  /api/auth/signup
    POST  /api/auth/register   (alias of signup)
    POST  /api/auth/login

  Authenticated (Authorization: Bearer <token>)
    GET   /api/auth/me
    GET   /api/projects
    POST  /api/projects                    Admin only (create)
    GET   /api/projects/:projectId
    PATCH /api/projects/:projectId         Owner or Admin
    POST  /api/projects/:projectId/members Invite by email
    GET   /api/projects/:projectId/tasks
    POST  /api/projects/:projectId/tasks
    PATCH /api/projects/:projectId/tasks/:taskId
    DELETE /api/projects/:projectId/tasks/:taskId
    GET   /api/dashboard/summary
    POST  /api/demo/seed

  In production, non-API routes serve the React SPA from backend/public.


--------------------------------------------------------------------------------
ROLE PERMISSIONS (SUMMARY)
--------------------------------------------------------------------------------

  Admin (app-wide)
    - Create projects
    - Full task control on accessible projects
    - Manage project members and roles (when project owner or admin on project)
    - Delete any task they can access

  Member (app-wide)
    - Cannot create projects (unless also project owner via membership)
    - Create tasks on projects they belong to
    - Assign tasks only to themselves (unless project admin/owner rules apply)
    - Edit tasks they created or are assigned to
    - Cannot invite members or change project settings unless they are the
      project owner or have Admin role on that project

  Per-project roles (ProjectMember.role) further restrict team management on
  a given project. The UI enforces these rules; the API returns 403 when
  an action is not allowed.


--------------------------------------------------------------------------------
DEMO DATA
--------------------------------------------------------------------------------

  After signing in, use "Seed demo data" on the dashboard.

  Creates (if missing):
    - Project: "Launch Sprint"
    - Sample tasks with mixed status, priority, and due dates
    - Demo member account

  Demo member credentials (after seed):
    Email     member@demo.local
    Password  Demo123!

  Sign out and log in as the demo member to test Member-only behavior.


--------------------------------------------------------------------------------
DATABASE MIGRATIONS
--------------------------------------------------------------------------------

  Migrations live in backend/prisma/migrations/.

  Production / Railway start:
    prisma migrate deploy   (runs automatically on npm start)

  Local development (new migration from schema changes):
    cd backend && npm run migrate:dev

  Reset database (destructive — deletes all data):
    cd backend && npm run migrate:reset

  Troubleshooting
    - P3018 / checksum errors: database may have diverged; reset on a dev DB or
      recreate the Postgres instance, then migrate:deploy again.
    - Connection errors: verify DATABASE_URL host, user, password, and SSL mode.


--------------------------------------------------------------------------------
TROUBLESHOOTING
--------------------------------------------------------------------------------

  "Cannot find module dist/server.js"
    Run a full build first:  npm run build  (from repo root) or
    cd backend && npm run build

  Frontend shows API errors locally
    Ensure backend is running on port 4000 and DATABASE_URL is valid.
    Check backend terminal for Prisma or JWT errors.

  Railway build succeeds but app crashes on start
    Set DATABASE_URL, JWT_SECRET, and NODE_ENV=production on the Web Service.
    Check deploy logs for migration failures.

  Only *.railway.internal URL visible
    Generate a public domain under Web Service -> Settings -> Networking.

  Empty UI in production
    Build must output to backend/public. Root deploy uses nixpacks build:
    "cd backend && npm run build". Do not deploy frontend as a separate service
    unless you configure VITE_API_URL and CORS separately.


--------------------------------------------------------------------------------
SUBMISSION CHECKLIST
--------------------------------------------------------------------------------

  [ ] Live URL loads signup/login and dashboard
  [ ] Signup, login, create project, tasks, and invites work on live URL
  [ ] README.txt submission links filled in (top of this file)
  [ ] GitHub repo is accessible to reviewers
  [ ] Demo video uploaded per assignment instructions
  [ ] Railway health check passes (/api/health)


--------------------------------------------------------------------------------
LICENSE / AUTHOR
--------------------------------------------------------------------------------

  Academic assignment submission. Update author name and course details here
  if required by your institution.

  Author : _________________________________________________
  Course : _________________________________________________

================================================================================
