# Quick Start - Deploy to Vercel

## 🚀 Deploy Frontend in 5 Minutes

### Step 1: Install Vercel CLI
```bash
npm i -g vercel
```

### Step 2: Navigate to Frontend
```bash
cd frontend
```

### Step 3: Deploy
```bash
vercel
```

Follow the prompts:
- Set up and deploy? **Yes**
- Link to existing project? **No** (first time)
- Project name: `zaeng-construction-platform` (or your choice)
- Directory: `./` (current directory)

### Step 4: Set Backend API URL
```bash
vercel env add VITE_API_URL
```

When prompted, enter your backend API URL:
- If using Railway: `https://your-app.railway.app/api`
- If using Render: `https://your-app.onrender.com/api`
- If using local backend: `http://localhost:3000/api` (for testing)

### Step 5: Deploy to Production
```bash
vercel --prod
```

### Step 6: Get Your URL
After deployment, Vercel will give you a URL like:
```
https://zaeng-construction-platform.vercel.app
```

## 🎯 What You Can Use Now

Once deployed, you can:
- ✅ View the login/register pages
- ✅ Test the UI and navigation
- ✅ See the dashboard structure
- ⚠️ **Note**: Full functionality requires backend deployment

## 🔧 Backend Deployment (Required for Full Features)

The backend needs to be deployed separately. Options:

### Option 1: Railway (Easiest)
1. Go to [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Select your repository and `backend` folder
4. Add PostgreSQL and Redis
5. Set environment variables
6. Get your Railway URL and update `VITE_API_URL` in Vercel

### Option 2: Render
1. Go to [render.com](https://render.com)
2. New Web Service
3. Connect GitHub → Select `backend`
4. Add PostgreSQL and Redis
5. Set environment variables
6. Deploy and get URL

## 📝 Next Steps

1. **Deploy Frontend**: ✅ Done (you just did this!)
2. **Deploy Backend**: Use Railway/Render (see above)
3. **Set Environment Variables**: Update `VITE_API_URL` to your backend URL
4. **Test**: Visit your Vercel URL and test login/registration

## 🐛 Troubleshooting

### Frontend builds but API calls fail
- Check `VITE_API_URL` is set correctly in Vercel
- Verify backend is running and accessible
- Check CORS settings in backend

### Build errors
- Make sure Node.js 18+ is used (Vercel uses this automatically)
- Check for TypeScript errors locally first

### Can't connect to backend
- Verify backend URL is correct
- Check backend is deployed and running
- Verify CORS allows your Vercel domain

## 📚 Full Documentation

See `DEPLOYMENT.md` for comprehensive deployment guide.

