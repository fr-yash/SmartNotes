# 🏗️ Architecture Overview - Smart Notes

## Development Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    LOCAL DEVELOPMENT                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────┐         ┌──────────────────────┐  │
│  │   FRONTEND (Vite)    │         │   BACKEND (Express)  │  │
│  │  localhost:5173      │         │   localhost:5000     │  │
│  │                      │         │                      │  │
│  │  - React Components  │◄────────│  - API Routes        │  │
│  │  - Pages             │  HTTP   │  - Controllers       │  │
│  │  - Services          │         │  - Middleware        │  │
│  │  - Contexts          │         │  - Models            │  │
│  │                      │         │                      │  │
│  │  .env:               │         │  .env:               │  │
│  │  VITE_API_URL=       │         │  MONGO_URI=...       │  │
│  │  http://localhost:   │         │  JWT_SECRET=...      │  │
│  │  5000/api            │         │  CORS_ORIGIN=*       │  │
│  └──────────────────────┘         └──────────────────────┘  │
│           │                                  │                │
│           └──────────────────────────────────┘                │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         MONGODB (Local or Atlas)                     │   │
│  │  - Users (with role field)                           │   │
│  │  - Notes                                             │   │
│  │  - Summaries (cached)                                │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Production Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                    PRODUCTION DEPLOYMENT                          │
├──────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ┌────────────────────────────┐    ┌──────────────────────────┐  │
│  │  FRONTEND (Vercel/Netlify) │    │  BACKEND (Render)        │  │
│  │  https://smartnotes.       │    │  https://smartnotes-     │  │
│  │  vercel.app                │    │  backend-jt93.onrender.  │  │
│  │                            │    │  com                     │  │
│  │  - React Build (dist/)     │    │  - Node.js Server        │  │
│  │  - Static Assets           │    │  - API Endpoints         │  │
│  │  - CDN Cached              │    │  - Admin Routes          │  │
│  │                            │    │  - Auth Middleware       │  │
│  │  .env.production:          │    │  - RBAC Middleware       │  │
│  │  VITE_API_URL=             │    │                          │  │
│  │  https://smartnotes-       │    │  .env (on Render):       │  │
│  │  backend-jt93.onrender.    │    │  MONGO_URI=...           │  │
│  │  com/api                   │    │  JWT_SECRET=...          │  │
│  │                            │    │  CORS_ORIGIN=            │  │
│  │                            │    │  https://smartnotes.     │  │
│  │                            │    │  vercel.app              │  │
│  └────────────────────────────┘    └──────────────────────────┘  │
│           │                                  │                    │
│           │         HTTPS                    │                    │
│           └──────────────────────────────────┘                    │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │         MONGODB ATLAS (Cloud)                            │   │
│  │  - Users (with role field)                               │   │
│  │  - Notes                                                 │   │
│  │  - Summaries (cached)                                    │   │
│  │  - IP Whitelist: Render backend IP                       │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │         EXTERNAL SERVICES                                │   │
│  │  - Google Gemini API (AI features)                        │   │
│  │  - GitHub (source code)                                  │   │
│  │  - Vercel (frontend deployment)                          │   │
│  │  - Render (backend deployment)                           │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                    │
└──────────────────────────────────────────────────────────────────┘
```

## API Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    API REQUEST FLOW                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  1. Frontend makes request:                                  │
│     fetch('/api/admin/analytics')                            │
│                                                               │
│  2. API URL Resolution:                                      │
│     - Development: http://localhost:5000/api/admin/analytics │
│     - Production: https://smartnotes-backend-jt93.onrender.  │
│                   com/api/admin/analytics                    │
│                                                               │
│  3. Backend receives request:                                │
│     GET /api/admin/analytics                                 │
│                                                               │
│  4. Middleware chain:                                        │
│     ├─ CORS Check (CORS_ORIGIN)                              │
│     ├─ Auth Middleware (JWT verification)                    │
│     ├─ Admin Middleware (role check)                         │
│     └─ Request Handler                                       │
│                                                               │
│  5. Controller processes:                                    │
│     ├─ Query MongoDB                                         │
│     ├─ Calculate analytics                                   │
│     └─ Return JSON response                                  │
│                                                               │
│  6. Frontend receives response:                              │
│     {                                                         │
│       totalUsers: 2,                                          │
│       activeUsers: 2,                                         │
│       adminUsers: 1,                                          │
│       ...                                                     │
│     }                                                         │
│                                                               │
│  7. Frontend renders data:                                   │
│     Admin Dashboard displays analytics                        │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Authentication Flow

```
┌─────────────────────────────────────────────────────────────┐
│                  AUTHENTICATION FLOW                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  1. User Login:                                              │
│     POST /api/auth/login                                     │
│     { email, password }                                      │
│                                                               │
│  2. Backend validates:                                       │
│     ├─ Find user by email                                    │
│     ├─ Compare password hash                                 │
│     └─ Generate JWT token                                    │
│                                                               │
│  3. Response includes:                                       │
│     {                                                         │
│       token: "eyJhbGc...",                                    │
│       user: {                                                 │
│         id: "...",                                            │
│         name: "...",                                          │
│         email: "...",                                         │
│         role: "admin"  ← IMPORTANT!                           │
│       }                                                       │
│     }                                                         │
│                                                               │
│  4. Frontend stores:                                         │
│     localStorage.setItem('token', token)                     │
│     localStorage.setItem('user', JSON.stringify(user))       │
│                                                               │
│  5. Subsequent requests:                                     │
│     Authorization: Bearer eyJhbGc...                          │
│                                                               │
│  6. Backend verifies:                                        │
│     ├─ Decode JWT                                            │
│     ├─ Check user exists                                     │
│     ├─ Check user role (for admin routes)                    │
│     └─ Check user is active                                  │
│                                                               │
│  7. Access granted/denied:                                   │
│     ├─ Admin routes: role === 'admin'                        │
│     ├─ User routes: isActive === true                        │
│     └─ Public routes: no auth needed                         │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Admin Dashboard Access Control

```
┌─────────────────────────────────────────────────────────────┐
│              ROLE-BASED ACCESS CONTROL (RBAC)                │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  User Roles:                                                 │
│  ├─ 'user': Regular user                                     │
│  │  ├─ Can create notes                                      │
│  │  ├─ Can use AI features                                   │
│  │  ├─ Can export notes                                      │
│  │  └─ Cannot access admin panel                             │
│  │                                                            │
│  └─ 'admin': Administrator                                   │
│     ├─ Can do everything a user can                          │
│     ├─ Can access admin dashboard                            │
│     ├─ Can view all users                                    │
│     ├─ Can suspend/activate users                            │
│     ├─ Can promote/demote users                              │
│     ├─ Can delete users                                      │
│     ├─ Can update AI limits                                  │
│     ├─ Can view analytics                                    │
│     └─ Can manage templates                                  │
│                                                               │
│  Frontend Check:                                             │
│  if (user?.role === 'admin') {                               │
│    show Admin link in navbar                                 │
│  }                                                            │
│                                                               │
│  Backend Check:                                              │
│  adminMiddleware:                                            │
│  ├─ Verify JWT token                                         │
│  ├─ Check user.role === 'admin'                              │
│  └─ Allow/deny access                                        │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow: Admin Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│           ADMIN DASHBOARD DATA FLOW                           │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  User clicks Admin link                                      │
│         │                                                     │
│         ▼                                                     │
│  Frontend: /admin route                                      │
│         │                                                     │
│         ▼                                                     │
│  Check: user?.role === 'admin'?                              │
│         │                                                     │
│    ┌────┴────┐                                               │
│    │         │                                               │
│   YES       NO                                               │
│    │         │                                               │
│    ▼         ▼                                               │
│  Load      Redirect to                                       │
│  Admin     /dashboard                                        │
│  Panel     (exit)                                            │
│    │                                                          │
│    ▼                                                          │
│  Fetch data from 3 tabs:                                     │
│  ├─ Analytics: GET /api/admin/analytics                      │
│  ├─ Users: GET /api/admin/users                              │
│  └─ Templates: GET /api/admin/templates                      │
│    │                                                          │
│    ▼                                                          │
│  Backend processes each request:                             │
│  ├─ Verify JWT token                                         │
│  ├─ Check role === 'admin'                                   │
│  ├─ Query MongoDB                                            │
│  └─ Return data                                              │
│    │                                                          │
│    ▼                                                          │
│  Frontend renders:                                           │
│  ├─ Analytics cards with stats                               │
│  ├─ Users table with actions                                 │
│  └─ Templates list                                           │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Environment Variable Resolution

```
┌─────────────────────────────────────────────────────────────┐
│         ENVIRONMENT VARIABLE RESOLUTION                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Frontend Build Process:                                     │
│                                                               │
│  npm run build                                               │
│         │                                                     │
│         ▼                                                     │
│  Vite detects: NODE_ENV=production                           │
│         │                                                     │
│         ▼                                                     │
│  Load .env.production                                        │
│  VITE_API_URL=https://smartnotes-backend-jt93.onrender.com/api
│         │                                                     │
│         ▼                                                     │
│  Inject into build                                           │
│         │                                                     │
│         ▼                                                     │
│  All API calls use production URL                            │
│                                                               │
│  ─────────────────────────────────────────────────────────   │
│                                                               │
│  Frontend Dev Process:                                       │
│                                                               │
│  npm run dev                                                 │
│         │                                                     │
│         ▼                                                     │
│  Vite detects: NODE_ENV=development                          │
│         │                                                     │
│         ▼                                                     │
│  Load .env                                                   │
│  VITE_API_URL=http://localhost:5000/api                      │
│         │                                                     │
│         ▼                                                     │
│  All API calls use localhost                                 │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

**This architecture ensures seamless operation in both development and production environments!**

