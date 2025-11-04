# 🔐 Vercel Environment Variables

## Required Environment Variables for Frontend

### Essential (Required)

```env
VITE_API_URL=https://your-backend-url.com/api
```

**Description**: The backend API URL where your NestJS backend is deployed.

**Examples**:
- Local development: `http://localhost:3000/api`
- Railway: `https://your-app.railway.app/api`
- Render: `https://your-app.onrender.com/api`
- AWS/Hetzner: `https://api.zaeng.co.za/api`

### Optional (For Future Features)

These are not required for initial deployment but may be needed later:

```env
# Analytics (optional)
VITE_ANALYTICS_ID=your-analytics-id

# Feature flags (optional)
VITE_ENABLE_WHATSAPP=true
VITE_ENABLE_MARKETPLACE=true
```

## 🚀 How to Set in Vercel

### Method 1: Vercel Dashboard

1. Go to your Vercel project
2. Click **Settings** → **Environment Variables**
3. Click **Add New**
4. Enter:
   - **Key**: `VITE_API_URL`
   - **Value**: Your backend URL (e.g., `https://your-backend.railway.app/api`)
   - **Environment**: Select all (Production, Preview, Development)
5. Click **Save**

### Method 2: Vercel CLI

```bash
cd frontend
vercel env add VITE_API_URL
# Enter your backend URL when prompted
# Select environments: Production, Preview, Development
```

### Method 3: During Deployment

When deploying via Vercel dashboard for the first time, you can add it in the "Environment Variables" section before clicking "Deploy".

## 📋 Current Configuration

The frontend uses these environment variables:

- `VITE_API_URL` - Backend API endpoint (required)
- All other variables are optional for now

## ⚠️ Important Notes

1. **VITE_ prefix required**: All Vite environment variables must start with `VITE_`
2. **Build-time only**: These are baked into the build, not runtime
3. **Public**: VITE_ variables are exposed to the browser (don't put secrets here)
4. **Redeploy needed**: After adding/changing env vars, Vercel will auto-redeploy

## 🔄 After Setting Environment Variables

1. Vercel will automatically redeploy
2. Wait 1-2 minutes for deployment to complete
3. Test your app - API calls should work

## 🧪 Testing

After setting `VITE_API_URL`, test in your deployed app:

1. Open browser console (F12)
2. Check Network tab
3. Try logging in
4. API calls should go to your backend URL

## 📝 Example Values

### For Testing (Local Backend)
```
VITE_API_URL=http://localhost:3000/api
```

### For Production (Railway)
```
VITE_API_URL=https://zaeng-backend.railway.app/api
```

### For Production (Render)
```
VITE_API_URL=https://zaeng-backend.onrender.com/api
```

### For Production (Custom Domain)
```
VITE_API_URL=https://api.zaeng.co.za/api
```

## ✅ Checklist

- [ ] `VITE_API_URL` set in Vercel
- [ ] Environment selected: Production, Preview, Development
- [ ] Backend URL is correct and accessible
- [ ] CORS configured on backend to allow Vercel domain
- [ ] Redeployed after setting env vars

## 🔗 Related

- Backend environment variables: See `../backend/.env.example`
- Deployment guide: See `../DEPLOYMENT.md`
- Troubleshooting: See `VERCEL_FIX.md`

