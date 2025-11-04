# 🚀 Deploy Now - Quick Commands

## If you're already logged in to Vercel:

```bash
cd frontend
vercel
```

Then follow prompts and answer:
- **Yes** to set up and deploy
- **No** to link existing project (first time)
- Project name: `zaeng-construction-platform`
- Directory: `./`

## If you need to login first:

```bash
cd frontend
vercel login
# Browser will open - complete login
vercel
```

## After deployment:

1. **Set environment variable:**
```bash
vercel env add VITE_API_URL
# Enter: http://localhost:3000/api (for testing)
# Or: https://your-backend.railway.app/api (when backend is ready)
```

2. **Deploy to production:**
```bash
vercel --prod
```

3. **Get your URL** - Vercel will show you the deployment URL

## Alternative: Use the script

```bash
cd frontend
./deploy.sh
```

## ⚠️ Important Notes

- Vercel will use Node.js 18+ automatically (even if local is v16)
- First deployment might take 2-3 minutes
- You'll get a `.vercel` folder with project config
- Each deployment creates a preview URL
- Production URL is permanent

## 🎯 What Happens

1. Vercel builds your React app
2. Deploys to global CDN
3. Provides HTTPS URL
4. Sets up automatic deployments on git push

## 📱 Your Deployed App

After deployment, you'll get:
- Preview URL: `https://zaeng-construction-platform-xxx.vercel.app`
- Production URL: `https://zaeng-construction-platform.vercel.app` (after --prod)

Visit the URL to see your app live!

