# Za-Eng Construction Platform Architecture

## Overview

The Za-Eng Construction Platform is a modular, microservices-based SaaS application designed for construction contract management and compliance.

## System Architecture

### High-Level Architecture

```
┌─────────────────┐
│   Frontend      │  React + TypeScript + Vite
│   (Port 3001)   │
└────────┬────────┘
         │
         │ HTTP/REST
         │
┌────────▼────────┐
│   Backend API   │  NestJS + TypeScript
│   (Port 3000)   │
└────────┬────────┘
         │
    ┌────┴────┬─────────────┬─────────────┐
    │        │             │             │
┌───▼───┐ ┌──▼───┐   ┌─────▼─────┐  ┌─────▼─────┐
│Postgres│ │Redis │   │  S3/     │  │  AI APIs  │
│   DB   │ │Cache │   │ Object   │  │ (OpenAI,  │
│        │ │      │   │ Storage  │  │ Pinecone) │
└────────┘ └──────┘   └──────────┘  └───────────┘
```

## Technology Stack

### Backend
- **Framework**: NestJS (Node.js)
- **Language**: TypeScript
- **Database**: PostgreSQL 15
- **Cache**: Redis 7
- **ORM**: TypeORM
- **Authentication**: JWT + Passport
- **API Documentation**: Swagger/OpenAPI

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: React Query (TanStack Query)
- **Forms**: React Hook Form + Zod

### Infrastructure
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Cloud**: AWS / Hetzner (South African region preferred)
- **File Storage**: AWS S3 / Hetzner Object Storage

## Module Structure

### Phase 1 MVP Modules

1. **Authentication Module** (`auth`)
   - JWT-based authentication
   - User registration and login
   - Role-based access control

2. **Users Module** (`users`)
   - User management
   - Multi-tenant support
   - Role management

3. **Projects Module** (`projects`)
   - Project creation and management
   - Contract type selection
   - Project metadata

4. **Contracts Module** (`contracts`)
   - Contract upload and processing
   - Clause library management
   - Z-clause detection

5. **Notices Module** (`notices`)
   - Notice creation and management
   - Claim processing
   - Time-bar tracking

6. **Evidence Module** (`evidence`)
   - File upload and storage
   - OCR processing
   - Evidence linking

7. **Marketplace Module** (`marketplace`)
   - Expert directory
   - Work order management
   - Quote system

8. **Admin Module** (`admin`)
   - System configuration
   - Rule engine management
   - Analytics dashboard

9. **Notifications Module** (`notifications`)
   - Email notifications
   - WhatsApp integration (Phase 2)
   - In-app notifications

10. **Reports Module** (`reports`)
    - Notice register reports
    - Compliance reports
    - Analytics reports

## Database Schema

### Core Entities

- **users**: User accounts with multi-tenant support
- **projects**: Construction projects
- **contracts**: Contract documents and metadata
- **clauses**: Clause library (central and project-specific)
- **notices**: Contractual notices
- **claims**: Extension of time and cost claims
- **evidence**: Supporting documents and files
- **experts**: Marketplace expert directory
- **work_orders**: Expert service requests

## Security Architecture

### Authentication & Authorization
- JWT tokens with refresh token support
- Role-based access control (RBAC)
- Multi-tenant data isolation

### Data Protection
- AES-256 encryption at rest
- TLS 1.3 in transit
- POPIA/GDPR compliance
- Audit logging

### API Security
- Rate limiting
- Input validation
- SQL injection prevention (TypeORM)
- XSS protection

## AI Integration

### RAG (Retrieval-Augmented Generation)
- Vector database: Pinecone or pgvector
- Clause retrieval based on event descriptions
- Notice drafting with clause citations

### AI Governance
- Transparency: All outputs cite source clauses
- Traceability: Training data from approved contracts only
- Human oversight: Legal validation required

## Deployment Architecture

### Development
- Docker Compose for local development
- Hot reload for both frontend and backend
- Local PostgreSQL and Redis instances

### Production
- Containerized deployment (Docker)
- Auto-scaling capable
- Load balancing ready
- Database replication support

## API Design

### RESTful Endpoints
- `/api/auth/*` - Authentication
- `/api/users/*` - User management
- `/api/projects/*` - Project management
- `/api/contracts/*` - Contract management
- `/api/notices/*` - Notice management
- `/api/evidence/*` - Evidence management
- `/api/marketplace/*` - Marketplace
- `/api/admin/*` - Admin functions
- `/api/reports/*` - Reporting

### Future: GraphQL
- Phase 2 will add GraphQL endpoint for flexible queries

## File Structure

```
AppConstruction/
├── backend/
│   ├── src/
│   │   ├── modules/          # Feature modules
│   │   ├── common/           # Shared utilities
│   │   ├── config/           # Configuration
│   │   └── main.ts          # Application entry
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── store/           # State management
│   │   ├── api/             # API client
│   │   └── main.tsx         # Application entry
│   ├── Dockerfile
│   └── package.json
├── docs/                     # Documentation
├── docker-compose.yml        # Local development
└── README.md
```

## Next Steps

1. **Phase 1 Completion**:
   - OCR integration
   - AI clause engine implementation
   - Rule engine configuration UI
   - File upload with S3/Hetzner integration

2. **Phase 2**:
   - Mobile app (React Native)
   - API integrations
   - Advanced analytics

3. **Phase 7-8**:
   - RFI Management module
   - Reporting & Documentation module

