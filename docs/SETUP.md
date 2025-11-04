# Setup Guide

## Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose
- PostgreSQL 15 (optional, Docker will provide)
- Redis 7 (optional, Docker will provide)

## Quick Start

### 1. Clone and Setup

```bash
cd AppConstruction
```

### 2. Environment Configuration

Copy `.env.example` to `.env` in the root directory and configure:

```bash
# For backend
cd backend
cp ../.env.example .env
# Edit .env with your configuration

# For frontend
cd ../frontend
# Create .env.local if needed
```

### 3. Start with Docker Compose

```bash
# From root directory
docker-compose up -d
```

This will start:
- PostgreSQL on port 5432
- Redis on port 6379
- Backend API on port 3000
- Frontend on port 3001

### 4. Manual Setup (Alternative)

#### Backend

```bash
cd backend
npm install
npm run start:dev
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Database Setup

The database will be automatically created when you start the application with `synchronize: true` in development mode.

For production, run migrations:

```bash
cd backend
npm run migration:run
```

## API Documentation

Once the backend is running, visit:
- Swagger UI: http://localhost:3000/api/docs

## Testing

### Backend Tests

```bash
cd backend
npm test
npm run test:e2e
```

### Frontend Tests

```bash
cd frontend
npm test
```

## Development Workflow

1. Backend changes are hot-reloaded automatically
2. Frontend changes are hot-reloaded via Vite
3. Check API docs at `/api/docs` for available endpoints
4. Use Docker Compose for consistent development environment

## Troubleshooting

### Port Already in Use

If ports 3000, 3001, 5432, or 6379 are in use:

1. Stop existing services
2. Or modify ports in `docker-compose.yml` and `.env`

### Database Connection Issues

1. Ensure PostgreSQL container is running: `docker ps`
2. Check database credentials in `.env`
3. Verify DATABASE_URL format: `postgresql://user:password@host:port/database`

### Frontend Can't Connect to Backend

1. Check `VITE_API_URL` in frontend `.env.local`
2. Ensure backend is running on port 3000
3. Check CORS settings in `backend/src/main.ts`

