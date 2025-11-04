# 🚀 Deploy to Vercel - Step by Step Instructions

## Quick Deploy (5 minutes)

### Step 1: Login to Vercel
```bash
cd frontend
vercel login
```
This will open your browser for authentication.

### Step 2: Deploy
```bash
vercel
```

**Answer the prompts:**
- Set up and deploy? → **Yes**
- Which scope? → Select your account
- Link to existing project? → **No** (first time)
- What's your project's name? → `zaeng-construction-platform` (or your choice)
- In which directory is your code located? → `./`

### Step 3: Set Environment Variable
```bash
vercel env add VITE_API_URL
```

**When prompted:**
- What's the value? → Enter your backend URL:
  - For testing: `http://localhost:3000/api`
  - For production: `https://your-backend.railway.app/api` (after backend is deployed)

### Step 4: Deploy to Production
```bash
vercel --prod
```

### Step 5: Get Your URL
After deployment, Vercel will show you a URL like:
```
https://zaeng-construction-platform.vercel.app
```

## Alternative: Deploy via GitHub + Vercel Dashboard

If CLI doesn't work, use the dashboard:

1. **Push to GitHub** (if not already done):
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push
```

2. **Go to [vercel.com](https://vercel.com)**
3. **Click "Add New Project"**
4. **Import your GitHub repository**
5. **Configure:**
   - Root Directory: `frontend`
   - Framework: **Vite** (auto-detected)
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. **Environment Variables:**
   - Key: `VITE_API_URL`
   - Value: Your backend URL
7. **Click Deploy**

## What You'll Get

After deployment:
- ✅ Live URL (e.g., `https://zaeng-construction-platform.vercel.app`)
- ✅ Automatic SSL certificate
- ✅ Global CDN
- ✅ Automatic deployments on git push
- ✅ Preview deployments for PRs

## Next Steps After Deployment

1. **Test the URL** - Visit your deployed site
2. **Update Backend CORS** - Add your Vercel domain to allowed origins
3. **Set Production API URL** - Update `VITE_API_URL` when backend is deployed

