# 🚀 Netlify Quick Start - Deploy in 5 Minutes

## ✅ Your Project is Ready for Netlify!

All configuration files are already created. Just follow these steps.

---

## 📋 What You Need

- GitHub account
- Netlify account (free at https://netlify.com)
- Backend deployed on Railway (or any hosting)

---

## 🎯 Deployment Steps

### Step 1: Push to GitHub (if not done)

```bash
git init
git add .
git commit -m "Ready for Netlify deployment"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

---

### Step 2: Deploy Backend on Railway First

**Why?** Frontend needs the backend URL.

1. Go to https://railway.app
2. Sign in with GitHub
3. New Project → Deploy from GitHub repo
4. **IMPORTANT**: Settings → Root Directory → Set to `/backend`
5. Variables → Add:
   ```
   NODE_ENV=production
   CORS_ORIGIN=https://your-site.netlify.app
   ```
6. Wait for deployment (2-3 minutes)
7. **Copy backend URL** (e.g., `https://backend-production-xxxx.up.railway.app`)

---

### Step 3: Deploy Frontend on Netlify

#### Using Netlify Dashboard (Easiest):

1. **Go to Netlify**
   - Visit https://app.netlify.com
   - Sign up/Login with GitHub

2. **Import Project**
   - Click "Add new site"
   - Choose "Import an existing project"
   - Select "Deploy with GitHub"
   - Authorize Netlify
   - Choose your repository

3. **Configure Site**
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`

4. **Add Environment Variable**
   - Click "Show advanced" (before deploy)
   - Or Site settings → Environment variables (after deploy)
   - Add variable:
     ```
     Key: VITE_API_URL
     Value: https://your-backend-url.railway.app
     ```
   - (Use your actual Railway URL from Step 2!)

5. **Deploy Site**
   - Click "Deploy site"
   - Wait 3-5 minutes
   - **Copy your Netlify URL**

---

### Step 4: Update Backend CORS

1. Go back to Railway dashboard
2. Click backend service
3. Variables tab
4. Update `CORS_ORIGIN` with your **actual Netlify URL**:
   ```
   CORS_ORIGIN=https://your-actual-site.netlify.app
   ```
5. Backend redeploys automatically

---

### Step 5: Test Your Site ✅

1. **Visit Your Netlify URL**
   - Open `https://your-site.netlify.app`
   - Dashboard should load

2. **Test Functionality**
   - Select "North Goa" → Data updates
   - Select "South Goa" → Data updates
   - Charts display correctly

3. **Check Console (F12)**
   - Should have NO errors
   - No CORS errors
   - API calls succeed (200 status)

4. **Test on Mobile**
   - Open on phone
   - Should work smoothly

---

## ✅ Success Checklist

- [ ] Backend deployed on Railway with `/backend` root directory
- [ ] Backend `CORS_ORIGIN` set to Netlify URL
- [ ] Frontend deployed on Netlify
- [ ] `VITE_API_URL` environment variable set in Netlify
- [ ] Frontend loads without errors
- [ ] District selection works
- [ ] Charts display data
- [ ] No CORS errors in console
- [ ] Works on mobile

---

## 🐛 Common Issues & Quick Fixes

### Issue: "Page not found" on Netlify

**Fix:**
- The `_redirects` file is already in `frontend/public/`
- If still seeing 404, trigger a redeploy:
  - Deploys → Trigger deploy → Clear cache and deploy site

---

### Issue: Blank/White Screen

**Fix:**
1. Check if `VITE_API_URL` is set:
   - Site settings → Environment variables
   - Should show `VITE_API_URL=your-backend-url`
2. If missing, add it and redeploy
3. **IMPORTANT**: Must redeploy after adding env vars!

---

### Issue: CORS Error in Console

```
Access to fetch blocked by CORS policy
```

**Fix:**
1. Go to Railway → Backend service → Variables
2. Check `CORS_ORIGIN` value
3. Must match Netlify URL EXACTLY:
   - ✅ `https://your-site.netlify.app`
   - ❌ `https://your-site.netlify.app/` (no trailing slash)
   - ❌ `http://your-site.netlify.app` (must be https)
4. Save and wait for backend redeploy

---

### Issue: "Network Error" / No Data Loading

**Fix:**
1. Check backend is running:
   - Visit: `https://your-backend-url.railway.app/health`
   - Should return: `{"status":"healthy"}`
2. If backend works, check frontend env var:
   - Netlify → Site settings → Environment variables
   - Verify `VITE_API_URL` matches backend URL exactly
3. Redeploy frontend after fixing

---

### Issue: Build Fails on Netlify

**Common errors:**

**"VITE_API_URL is not defined"**
- Add environment variable in Netlify
- Redeploy

**"Directory not found: dist"**
- Check publish directory is `frontend/dist`
- Or just `dist` if base directory is `frontend`

**"Command failed"**
- Check build logs for specific error
- Usually missing dependencies
- Push `package.json` to GitHub

---

## 🔑 Environment Variables Summary

### Backend (Railway):
```
NODE_ENV=production
CORS_ORIGIN=https://your-site.netlify.app
```

### Frontend (Netlify):
```
VITE_API_URL=https://your-backend-url.railway.app
```

**⚠️ CRITICAL**: Replace with your actual URLs!

---

## 💡 Pro Tips

1. **Always deploy backend FIRST** so you have the URL for frontend
2. **Copy URLs immediately** after each deployment
3. **Use exact URLs** - include `https://`, no trailing slash
4. **Redeploy frontend** after adding environment variables
5. **Check deploy logs** if something fails

---

## 🎯 Your Deployment URLs

After deployment, you'll have:

```
Frontend: https://your-site.netlify.app
Backend:  https://backend-production-xxxx.up.railway.app
```

Write these down! You'll need them.

---

## 📱 Testing Checklist

Visit your Netlify URL and verify:

- [ ] Homepage loads
- [ ] No JavaScript errors in console (F12)
- [ ] District dropdown works
- [ ] Selecting "North Goa" loads data
- [ ] Selecting "South Goa" loads data
- [ ] Charts render correctly
- [ ] Metric cards show numbers
- [ ] Works on mobile device
- [ ] Page refresh doesn't break (no 404)

---

## 🆘 Still Having Issues?

1. **Check build logs**: Netlify → Deploys → Click on deploy → View logs
2. **Check browser console**: F12 → Console tab
3. **Test backend**: Visit backend health endpoint
4. **Verify URLs**: Match exactly, no typos
5. **Read full guide**: `NETLIFY_DEPLOYMENT.md`

---

## 🎉 Success!

Once everything works, you have:

- ✅ Fast global CDN (Netlify)
- ✅ Reliable backend (Railway)
- ✅ HTTPS everywhere
- ✅ Auto-deploy from GitHub
- ✅ $0/month cost (free tiers)

**Share your site!**

---

## 📚 More Info

- Full guide: `NETLIFY_DEPLOYMENT.md`
- Backend setup: `RAILWAY_QUICK_FIX.md`
- Checklist: `CHECKLIST.md`

---

**Deployment Time**: 10 minutes  
**Cost**: $0/month  
**Difficulty**: Easy ⭐