# Fullstack CRUD Monorepo

Monorepo template with Turborepo, including:
- **User App**: Next.js + TypeScript + Tailwind + shadcn/ui
- **Admin App**: Vite + React + TypeScript + Tailwind
- **Backend**: NestJS + TypeORM + PostgreSQL

## 🚀 Tech Stack

### Monorepo
- **Turborepo** - Build system and task runner
- **pnpm** - Package manager
- **TypeScript** - Shared TypeScript config

### Frontend (User App)
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- TanStack Query (server data)
- Zustand (UI / auth state)
- react-hook-form (forms)

### Frontend (Admin App)
- Vite + React
- TypeScript
- Tailwind CSS
- React Router DOM

### Backend
- NestJS
- TypeORM
- PostgreSQL
- JWT Authentication
- Passport.js

## 📁 Project Structure

```
fullstack-crud/
├── apps/
│   ├── user-app/          # Next.js User Application
│   ├── admin-app/         # Vite + React Admin Dashboard
│   └── backend/           # NestJS Backend API
├── packages/
│   └── shared/            # Shared packages (types, utils)
├── package.json           # Root workspace config
├── turbo.json            # Turborepo config
├── pnpm-workspace.yaml    # pnpm workspace config
└── tsconfig.json          # Base TypeScript config
```

## 🛠️ Setup

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- PostgreSQL (for backend)

### Installation

1. **Clone repository**
```bash
git clone <your-repo-url>
cd fullstack-crud
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Setup environment variables**

Backend:
```bash
cd apps/backend
cp .env.example .env
# Edit .env with your database information
```

4. **Start PostgreSQL database**
```bash
# Make sure PostgreSQL is running
# Create database: fullstack_crud (or name in .env)
```

5. **Run development servers**
```bash
# From root directory
pnpm dev
```

This will run:
- User App: http://localhost:3000
- Admin App: http://localhost:3001
- Backend API: http://localhost:3002

## 📝 Scripts

### Root Level

```bash
pnpm dev          # Run all apps in dev mode
pnpm build        # Build all apps
pnpm lint         # Lint all apps
pnpm clean        # Clean build artifacts
```

### Individual Apps

You can run commands for each app in 2 ways:

**Method 1: Using `--filter` (recommended - no need to cd)**
```bash
# User App
pnpm --filter user-app dev      # Next.js dev server
pnpm --filter user-app build    # Build production
pnpm --filter user-app start    # Start production server

# Admin App
pnpm --filter admin-app dev     # Vite dev server
pnpm --filter admin-app build   # Build production
pnpm --filter admin-app preview # Preview production build

# Backend
pnpm --filter backend dev       # NestJS dev server (watch mode)
pnpm --filter backend build     # Build production
pnpm --filter backend start:prod # Start production server
```

**Method 2: cd into app directory**
```bash
# User App
cd apps/user-app
pnpm dev          # Next.js dev server
pnpm build        # Build production
pnpm start        # Start production server

# Admin App
cd apps/admin-app
pnpm dev          # Vite dev server
pnpm build        # Build production
pnpm preview      # Preview production build

# Backend
cd apps/backend
pnpm dev          # NestJS dev server (watch mode)
pnpm build        # Build production
pnpm start:prod   # Start production server
```

## 🔧 Development

### Adding a New App

1. Create new directory in `apps/`
2. Setup package.json with dependencies
3. Add to `pnpm-workspace.yaml` (automatically detected if in `apps/*`)
4. Turborepo will automatically detect it

### Adding Shared Packages

1. Create package in `packages/`
2. Setup package.json
3. Import in apps: `"@repo/shared": "workspace:*"`

## 🌐 Environment Variables

### Backend (.env)

See `apps/backend/.env.example` for required environment variables:

- `DB_HOST` - PostgreSQL host
- `DB_PORT` - PostgreSQL port
- `DB_USERNAME` - Database username
- `DB_PASSWORD` - Database password
- `DB_DATABASE` - Database name
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRES_IN` - JWT expiration time
- `PORT` - Backend server port (default: 3002)

### Frontend Apps

Frontend apps may need:
- `NEXT_PUBLIC_API_URL` (user-app) - Backend API URL
- `VITE_API_URL` (admin-app) - Backend API URL

## 📦 Dependencies Management

Project uses **pnpm workspaces** and **Turborepo**:

- **pnpm**: Dependency management and hoisting
- **Turborepo**: Caching and parallel execution

### Adding Dependencies

```bash
# Root level (dev dependencies)
pnpm add -D -w <package>

# Specific app
pnpm add <package> --filter user-app
pnpm add <package> --filter admin-app
pnpm add <package> --filter backend
```

## 🏗️ Build & Deploy

### Build All Apps

```bash
pnpm build
```

Outputs:
- `apps/user-app/.next/` - Next.js build
- `apps/admin-app/dist/` - Vite build
- `apps/backend/dist/` - NestJS build

### Production

1. Build all apps: `pnpm build`
2. Deploy each app to your platform:
   - User App: Vercel, Netlify, etc.
   - Admin App: Vercel, Netlify, etc.
   - Backend: Railway, Render, AWS, etc.

## 🧪 Testing

```bash
# Run tests (when available)
pnpm test

# Backend tests
cd apps/backend
pnpm test
```

## 📚 Project Status

This is a template/base project. Currently in foundation setup phase.

## 🤝 Contributing

1. Create a new branch
2. Commit your changes
3. Push and create a Pull Request

## 📄 License

MIT

---

**Note**: This is a reusable monorepo template for other projects. Rename the project and customize as needed.
