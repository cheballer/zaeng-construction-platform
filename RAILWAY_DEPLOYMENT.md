# 🚂 Railway Backend Deployment Guide

## Quick Fix Checklist

### ✅ Critical Environment Variables (MUST SET)

In Railway → Your Service → Variables, set these:

1. **`PORT`** = Leave empty (Railway sets this automatically) OR set to `3000` if Railway expects it
2. **`NODE_ENV`** = `production`
3. **`DATABASE_URL`** = Get from Railway PostgreSQL service (e.g., `postgresql://postgres:password@host:5432/railway`)
4. **`FRONTEND_URL`** = `https://zaeng-construction-platform-a3k6.vercel.app`
5. **`JWT_SECRET`** = Generate a secure random string (e.g., use `openssl rand -base64 32`)

### ⚠️ Why Backend Failed

The most common reasons:
1. **Missing DATABASE_URL** - App crashes on startup if database connection fails
2. **Port mismatch** - Railway sets PORT dynamically, app must use it
3. **Database connection failing** - Check DATABASE_URL format and SSL settings

## Step-by-Step Railway Setup

### 1. Add PostgreSQL Database

1. In Railway project, click **"+ New"**
2. Select **"Database"** → **"Add PostgreSQL"**
3. Railway will create a PostgreSQL instance
4. Go to the PostgreSQL service → **Variables** tab
5. Copy the **`DATABASE_URL`** (or `PGDATABASE`, `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`)

### 2. Configure Backend Service

1. In Railway project, select your backend service
2. Go to **Variables** tab
3. Add these variables:

```env
# Required
NODE_ENV=production
DATABASE_URL=postgresql://postgres:password@hostname:5432/railway
FRONTEND_URL=https://zaeng-construction-platform-a3k6.vercel.app
JWT_SECRET=your-secret-key-here-generate-with-openssl-rand-base64-32
JWT_EXPIRES_IN=7d

# Port (Railway sets automatically, but can override)
PORT=3000

# Optional (for full functionality)
REDIS_URL=redis://host:6379
OPENAI_API_KEY=your-openai-key
PINECONE_API_KEY=your-pinecone-key
PINECONE_INDEX=zaeng-clauses
VECTOR_DB_PROVIDER=pinecone
STORAGE_PROVIDER=hetzner
HETZNER_ACCESS_KEY=your-key
HETZNER_SECRET_KEY=your-secret
HETZNER_ENDPOINT=your-endpoint
HETZNER_BUCKET=zaeng-uploads
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@zaeng.co.za
```

### 3. Configure Networking

1. Go to your backend service → **Settings** → **Networking**
2. Click **"Generate Domain"**
3. Set **Target Port** = `3000` (or whatever PORT env var is set to)
4. Railway will generate a public URL like: `https://your-app.up.railway.app`

### 4. Verify Database Connection

The backend needs DATABASE_URL to start. Check:

1. **Format**: `postgresql://user:password@host:port/database`
2. **SSL**: Railway PostgreSQL requires SSL in production
   - The code handles this: `ssl: { rejectUnauthorized: false }` in production
3. **Connection**: Test by checking Railway logs for connection errors

### 5. Check Deployment Logs

1. Railway → Your Service → **Deployments** tab
2. Click latest deployment
3. Check **Logs** for:
   - ✅ Success: `🚀 Za-Eng Platform API running on: http://localhost:3000/api`
   - ❌ Error: Database connection failures, missing env vars, port binding errors

## Common Issues & Fixes

### Issue 1: "Application failed to respond"

**Cause**: App crashed on startup

**Fix**:
1. Check logs for errors
2. Verify `DATABASE_URL` is set and correct
3. Ensure `NODE_ENV=production`
4. Check if PORT is being used correctly

### Issue 2: Database Connection Error

**Symptoms in logs**:
```
Error: connect ECONNREFUSED
Error: password authentication failed
```

**Fix**:
1. Copy DATABASE_URL from PostgreSQL service (not manually typed)
2. Verify SSL is enabled (code handles this automatically)
3. Check PostgreSQL service is running

### Issue 3: Port Binding Error

**Symptoms**:
```
Error: listen EADDRINUSE: address already in use
```

**Fix**:
1. Don't set PORT manually - let Railway set it
2. Or set PORT=3000 and match Target Port in Networking settings
3. Updated code now uses `process.env.PORT` first

### Issue 4: Build Fails

**Symptoms**: Deployment stops at build stage

**Fix**:
1. Check `package-lock.json` is committed (✅ we fixed this)
2. Verify TypeScript compilation succeeds (✅ we fixed errors)
3. Check Railway logs for specific build errors

## Testing After Deployment

### 1. Check Health

Visit:
```
https://your-app.up.railway.app/api/docs
```

Should show Swagger API documentation.

### 2. Test Endpoints

```bash
# Health check (if endpoint exists)
curl https://your-app.up.railway.app/api

# Test register endpoint
curl -X POST https://your-app.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123456","firstName":"Test","lastName":"User"}'
```

### 3. Check Logs

Railway → Service → Logs tab shows real-time logs.

## Environment Variable Priority

The app now uses:
1. `process.env.PORT` (set by Railway automatically)
2. `configService.get('PORT')` (from env file)
3. Default: `3000`

## Next Steps After Backend Works

1. ✅ Update Vercel `VITE_API_URL` to Railway URL
2. ✅ Test registration from frontend
3. ✅ Verify database migrations run (or use `synchronize: true` in dev)
4. ✅ Monitor logs for any runtime errors

## Railway-Specific Notes

- **Dynamic Ports**: Railway sets PORT automatically - code now uses it
- **SSL Required**: PostgreSQL connections use SSL in production (handled automatically)
- **Auto-Deploy**: Railway redeploys on git push automatically
- **Logs**: Real-time logs available in Railway dashboard
- **Restart**: Railway auto-restarts on crashes (with backoff)

## Support

If still failing:
1. Share Railway deployment logs (last 50-100 lines)
2. List all environment variables set (redact secrets)
3. Check Railway status page for service issues

