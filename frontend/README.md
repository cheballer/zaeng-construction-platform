# Za-Eng Construction Platform - Frontend

React + TypeScript + Vite frontend for the Za-Eng Construction Platform.

## Quick Deploy to Vercel

### Method 1: Vercel CLI (Recommended)

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (from frontend directory)
vercel

# Set environment variable
vercel env add VITE_API_URL

# Deploy to production
vercel --prod
```

### Method 2: Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your Git repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add Environment Variable:
   - **Key**: `VITE_API_URL`
   - **Value**: Your backend API URL (e.g., `https://your-backend.railway.app/api`)
6. Click **Deploy**

## Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

Create `.env.local` for local development:

```env
VITE_API_URL=http://localhost:3000/api
```

For Vercel, set `VITE_API_URL` in the dashboard or via CLI:

```bash
vercel env add VITE_API_URL production
```

## Backend Deployment

The backend needs to be deployed separately (Railway, Render, or AWS). Once deployed, update `VITE_API_URL` to point to your backend.

See `../DEPLOYMENT.md` for full deployment instructions.

