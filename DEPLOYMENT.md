# Deployment Guide

## Frontend Deployment on Vercel

The frontend is ready for deployment on Vercel. Follow these steps:

### Option 1: Deploy via Vercel CLI

1. **Install Vercel CLI** (if not already installed):
```bash
npm i -g vercel
```

2. **Navigate to frontend directory**:
```bash
cd frontend
```

3. **Login to Vercel**:
```bash
vercel login
```

4. **Deploy**:
```bash
vercel
```

5. **Follow the prompts**:
   - Set up and deploy? **Yes**
   - Which scope? (Select your account)
   - Link to existing project? **No**
   - Project name? (e.g., `zaeng-construction-platform`)
   - Directory? **./**
   - Override settings? **No**

6. **Set Environment Variables**:
```bash
vercel env add VITE_API_URL
# Enter your backend API URL when prompted
```

7. **Deploy to Production**:
```bash
vercel --prod
```

### Option 2: Deploy via Vercel Dashboard

1. **Go to [vercel.com](https://vercel.com)** and sign in
2. **Click "Add New Project"**
3. **Import your Git repository** (GitHub/GitLab/Bitbucket)
4. **Configure Project**:
   - Framework Preset: **Vite**
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

5. **Add Environment Variable**:
   - Key: `VITE_API_URL`
   - Value: Your backend API URL (e.g., `https://your-backend.railway.app/api`)

6. **Click Deploy**

### Backend Deployment Options

The backend (NestJS) cannot be deployed directly on Vercel. Use one of these options:

#### Option 1: Railway (Recommended for simplicity)

1. **Sign up at [railway.app](https://railway.app)**
2. **Create New Project**
3. **Add PostgreSQL Database**
4. **Add Redis**
5. **Deploy from GitHub**:
   - Connect your repository
   - Select the `backend` directory
   - Railway will auto-detect NestJS

6. **Set Environment Variables** in Railway dashboard:
```env
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_SECRET=your-secret
OPENAI_API_KEY=...
# ... (all other env vars from .env.example)
```

7. **Update Frontend VITE_API_URL** to point to Railway URL

#### Option 2: Render

1. **Sign up at [render.com](https://render.com)**
2. **Create New Web Service**
3. **Connect GitHub repository**
4. **Configure**:
   - Build Command: `cd backend && npm install && npm run build`
   - Start Command: `cd backend && npm run start:prod`
   - Environment: Node

5. **Add PostgreSQL and Redis** from Render dashboard
6. **Set all environment variables**
7. **Deploy**

#### Option 3: AWS/Hetzner (Production)

For production, deploy to AWS or Hetzner using Docker:

```bash
# Build Docker image
docker build -t zaeng-backend ./backend

# Run with docker-compose (already configured)
docker-compose up -d
```

### Environment Variables Setup

#### Frontend (.env or Vercel Dashboard)
```env
VITE_API_URL=https://your-backend-url.com/api
```

#### Backend (Railway/Render/AWS)
```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/dbname
REDIS_URL=redis://host:6379

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# Storage
STORAGE_PROVIDER=hetzner
HETZNER_ACCESS_KEY=...
HETZNER_SECRET_KEY=...
HETZNER_ENDPOINT=...
HETZNER_BUCKET=zaeng-uploads

# AI
OPENAI_API_KEY=...
VECTOR_DB_PROVIDER=pinecone
PINECONE_API_KEY=...
PINECONE_INDEX=zaeng-clauses

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=...
SMTP_PASSWORD=...
SMTP_FROM=noreply@zaeng.co.za

# WhatsApp (optional)
WHATSAPP_API_KEY=...
WHATSAPP_PHONE_NUMBER_ID=...

# Application
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://your-frontend.vercel.app
```

### Quick Deploy Script

Create a `deploy.sh` script for easy deployment:

```bash
#!/bin/bash

echo "🚀 Deploying Za-Eng Construction Platform..."

# Frontend to Vercel
echo "📦 Deploying frontend to Vercel..."
cd frontend
vercel --prod
cd ..

echo "✅ Deployment complete!"
echo "📝 Don't forget to:"
echo "   1. Set VITE_API_URL in Vercel dashboard"
echo "   2. Deploy backend to Railway/Render"
echo "   3. Update database migrations"
```

### Post-Deployment Checklist

- [ ] Frontend deployed on Vercel
- [ ] Backend deployed on Railway/Render/AWS
- [ ] Database created and migrations run
- [ ] Redis instance running
- [ ] Environment variables configured
- [ ] Storage bucket created (S3/Hetzner)
- [ ] Pinecone index created
- [ ] Domain configured (optional)
- [ ] SSL certificates active
- [ ] API documentation accessible
- [ ] Test login/registration
- [ ] Test file upload
- [ ] Test AI notice generation

### Troubleshooting

#### Frontend Build Errors
- Check Node.js version (should be 18+)
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check for TypeScript errors: `npm run build`

#### Backend Connection Issues
- Verify `VITE_API_URL` is correct
- Check CORS settings in backend
- Verify backend is running and accessible
- Check browser console for errors

#### Database Connection
- Verify DATABASE_URL format
- Check database is accessible from deployment platform
- Run migrations: `npm run migration:run`

### Monitoring

After deployment, monitor:
- Vercel Analytics (frontend)
- Railway/Render logs (backend)
- Database performance
- API response times
- Error rates

### Support

For deployment issues:
1. Check platform logs
2. Review environment variables
3. Verify API endpoints
4. Test locally first

