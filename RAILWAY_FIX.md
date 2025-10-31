# 🔧 Railway Deployment Fix Guide

## ❌ Error: "No start command could be found"

You're seeing this error because Railway is trying to deploy from the **root directory** instead of the backend or frontend directories.

---

## ✅ SOLUTION: Deploy Backend and Frontend Separately

This is a **monorepo** with two separate services. You MUST deploy them as two separate Railway services.

---

## 🚀 Step-by-Step Fix

### Step 1: Deploy Backend Service

1. **Go to Railway Dashboard** (https://railway.app/dashboard)

2. **If you already created a service:**
   - Click on your existing service
   - Go to **Settings** tab
   - Scroll to **Service Settings** section
   - Find **Root Directory**
   - Set it to: `/backend`
   - Click **Update** or **Save**
   - Go to **Deployments** tab
   - Click **Redeploy** (or push a new commit to trigger redeploy)

3. **If you haven't created a service yet:**
   - Click **New Project**
   - Select **Deploy from GitHub repo**
   - Choose your repository
   - After the service is created, immediately go to Settings
   - Set **Root Directory** to `/backend`
   - Service will redeploy automatically

4. **Set Environment Variables:**
   - Go to **Variables** tab
   - Add these variables:
     ```
     NODE_ENV=production
     CORS_ORIGIN=https://your-frontend-url.railway.app
     ```
   - Note: You'll update `CORS_ORIGIN` after frontend is deployed

5. **Wait for Deployment:**
   - Go to **Deployments** tab
   - Wait for deployment to complete (2-3 minutes)
   - Check logs for any errors
   - Copy the backend URL (e.g., `https://backend-production-abc123.up.railway.app`)

6. **Test Backend:**
   - Visit: `https://your-backend-url.railway.app/health`
   - Should return: `{"status":"healthy",...}`

---

### Step 2: Deploy Frontend Service

1. **In the SAME Railway project**, click **New** button

2. **Select GitHub Repo** again (yes, the same repo)

3. **After service is created:**
   - Go to **Settings** tab
   - Set **Root Directory** to: `/frontend`
   - Click **Update** or **Save**

4. **Set Environment Variables:**
   - Go to **Variables** tab
   - Add these variables:
     ```
     NODE_ENV=production
     VITE_API_URL=https://your-backend-url.railway.app
     ```
   - Replace with your actual backend URL from Step 1

5. **Wait for Deployment:**
   - Go to **Deployments** tab
   - Wait for build and deployment (3-5 minutes)
   - Copy the frontend URL

6. **Test Frontend:**
   - Visit: `https://your-frontend-url.railway.app`
   - Should load the dashboard

---

### Step 3: Update Backend CORS

1. **Go back to Backend Service**

2. **Update Variables:**
   - Go to **Variables** tab
   - Update `CORS_ORIGIN` with your actual frontend URL:
     ```
     CORS_ORIGIN=https://your-frontend-url.railway.app
     ```
   - Save (will trigger redeploy)

3. **Wait for Redeploy:**
   - Backend will redeploy automatically
   - Wait 1-2 minutes

---

### Step 4: Final Verification

1. **Visit Frontend URL**
   - Dashboard should load
   - Select a district
   - Data should update
   - Charts should display

2. **Check Browser Console (F12):**
   - Should have NO CORS errors
   - Should have NO network errors
   - API calls should succeed

3. **Test Both Districts:**
   - North Goa - should load data
   - South Goa - should load data

---

## 🎯 Visual Guide

```
Your Railway Project Should Look Like This:

┌─────────────────────────────────────┐
│  Railway Project                    │
│                                     │
│  ┌─────────────────────┐            │
│  │ Service 1: backend  │            │
│  │ Root: /backend      │            │
│  │ Status: Active      │            │
│  └─────────────────────┘            │
│                                     │
│  ┌─────────────────────┐            │
│  │ Service 2: frontend │            │
│  │ Root: /frontend     │            │
│  │ Status: Active      │            │
│  └─────────────────────┘            │
│                                     │
│  (Optional)                         │
│  ┌─────────────────────┐            │
│  │ MongoDB Plugin      │            │
│  └─────────────────────┘            │
└─────────────────────────────────────┘
```

---

## 📋 Quick Checklist

### Backend Service:
- [ ] Root Directory set to `/backend`
- [ ] `NODE_ENV=production` variable set
- [ ] `CORS_ORIGIN` variable set (will update after frontend)
- [ ] Deployment successful
- [ ] Health endpoint works: `/health`
- [ ] Backend URL copied

### Frontend Service:
- [ ] Root Directory set to `/frontend`
- [ ] `NODE_ENV=production` variable set
- [ ] `VITE_API_URL` variable set (pointing to backend)
- [ ] Deployment successful
- [ ] Frontend loads in browser
- [ ] Frontend URL copied

### Final Steps:
- [ ] Backend `CORS_ORIGIN` updated with frontend URL
- [ ] Backend redeployed
- [ ] No CORS errors in browser
- [ ] District selection works
- [ ] Charts display data

---

## 🐛 Common Issues

### Issue: "Still getting 'No start command' error"

**Solution:**
- You forgot to set the Root Directory
- Go to Service → Settings → Root Directory
- Set to `/backend` or `/frontend`
- Save and redeploy

### Issue: "CORS Error in browser console"

**Solution:**
```
Error: Access to fetch at 'https://backend...' from origin 'https://frontend...' has been blocked by CORS policy
```

1. Go to Backend service in Railway
2. Go to Variables tab
3. Check `CORS_ORIGIN` value
4. It MUST match your frontend URL EXACTLY:
   - Include `https://`
   - No trailing slash
   - Example: `https://frontend-production-abc123.up.railway.app`
5. Save and wait for redeploy

### Issue: "Frontend shows 'Network Error'"

**Solution:**
1. Go to Frontend service in Railway
2. Go to Variables tab
3. Check `VITE_API_URL` value
4. It MUST match your backend URL EXACTLY:
   - Include `https://`
   - No trailing slash
   - Example: `https://backend-production-xyz789.up.railway.app`
5. Redeploy frontend

### Issue: "Build fails with dependency errors"

**Solution:**
1. Make sure Root Directory is set correctly
2. Clear Railway build cache:
   - Settings → Clear Build Cache
   - Redeploy
3. Check Node version (Railway auto-detects, should be 18+)

### Issue: "Backend starts but API returns 500"

**Solution:**
- This is normal! Backend automatically uses CSV fallback
- Check Railway logs for specific errors
- MongoDB is optional - backend works with CSV data
- Verify CSV file exists: `backend/src/data/goa_mgnrega.csv`

---

## 📊 Environment Variables Reference

### Backend Variables

| Variable | Value | Example |
|----------|-------|---------|
| `NODE_ENV` | `production` | `production` |
| `PORT` | Auto-set by Railway | `5000` |
| `CORS_ORIGIN` | Your frontend URL | `https://frontend-production-abc123.up.railway.app` |
| `MONGODB_URI` | Optional | `mongodb://...` |

### Frontend Variables

| Variable | Value | Example |
|----------|-------|---------|
| `NODE_ENV` | `production` | `production` |
| `PORT` | Auto-set by Railway | `3000` |
| `VITE_API_URL` | Your backend URL | `https://backend-production-xyz789.up.railway.app` |

---

## 🎯 Testing Your Deployment

### Test Backend:
```bash
# Health check
curl https://your-backend-url.railway.app/health

# Expected response:
{"status":"healthy","timestamp":"...","uptime":123}

# Districts endpoint
curl https://your-backend-url.railway.app/api/districts

# Expected response:
{"success":true,"districts":["North Goa","South Goa"]}
```

### Test Frontend:
1. Visit: `https://your-frontend-url.railway.app`
2. Dashboard should load
3. Open browser DevTools (F12)
4. Go to Console tab
5. Should see NO errors
6. Go to Network tab
7. Select a district
8. Should see successful API calls (status 200)

---

## 💡 Pro Tips

1. **Always set Root Directory FIRST** before deploying
2. **Copy URLs immediately** after each service deploys
3. **Update CORS after frontend is deployed** - don't forget!
4. **Check Railway logs** if anything fails
5. **Use exact URLs** - no typos, include https://, no trailing slash

---

## 📞 Still Having Issues?

### Check These:

1. **Railway Dashboard:**
   - Are both services showing "Active"?
   - Check the Deployments tab for errors
   - Review the logs for specific error messages

2. **Browser Console (F12):**
   - Any red errors?
   - Network tab showing 200 status codes?

3. **URLs Match:**
   - Backend's `CORS_ORIGIN` = Frontend URL
   - Frontend's `VITE_API_URL` = Backend URL
   - Both include `https://`
   - Both have NO trailing slash

4. **Local Test:**
   ```bash
   # Test backend locally
   cd backend
   npm install
   npm start
   # Visit: http://localhost:5000/health
   
   # Test frontend locally
   cd frontend
   npm install
   npm run dev
   # Visit: http://localhost:3000
   ```

---

## ✅ Success Indicators

You'll know it's working when:

- ✅ Backend service shows "Active" in Railway
- ✅ Frontend service shows "Active" in Railway
- ✅ Backend health endpoint returns `{"status":"healthy"}`
- ✅ Frontend loads without errors
- ✅ Browser console shows NO CORS errors
- ✅ Selecting districts updates the data
- ✅ Charts render correctly
- ✅ Works on mobile devices

---

## 🎉 That's It!

Once both services are deployed with correct Root Directories and environment variables, everything should work perfectly.

**Remember:** This is a MONOREPO - you need TWO separate Railway services, each pointing to its own directory (`/backend` and `/frontend`).

---

**Questions?** Check `RAILWAY_DEPLOYMENT.md` for more detailed instructions.

**Last Updated:** December 2024  
**Status:** Fix for "No start command" error