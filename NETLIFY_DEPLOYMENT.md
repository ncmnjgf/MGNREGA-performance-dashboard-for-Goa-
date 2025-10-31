# 🚀 Netlify Deployment Guide - MGNREGA Goa Dashboard

Complete guide to deploy your MGNREGA Goa Dashboard on Netlify (Frontend) and Railway (Backend).

---

## 📋 Overview

**Deployment Strategy:**
- **Frontend (React)** → Netlify (Free, fast, CDN)
- **Backend (Node.js)** → Railway (Free tier, easy setup)

**Why This Combo?**
- ✅ Both have generous free tiers
- ✅ Easy setup and deployment
- ✅ Automatic deployments from GitHub
- ✅ HTTPS enabled by default
- ✅ Great performance

---

## 🎯 Quick Deploy Steps

### Part 1: Deploy Backend on Railway (5 minutes)

1. **Push to GitHub** (if not done already):
   ```bash
   git init
   git add .
   git commit -m "Ready for deployment"
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

2. **Deploy Backend on Railway**:
   - Go to https://railway.app
   - Sign in with GitHub
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Go to **Settings** → Set **Root Directory** to `/backend`
   - Go to **Variables** → Add:
     ```
     NODE_ENV=production
     CORS_ORIGIN=https://your-site.netlify.app
     ```
   - Wait for deployment (2-3 minutes)
   - **Copy your backend URL** (e.g., `https://backend-production-xxxx.up.railway.app`)

3. **Test Backend**:
   - Visit: `https://your-backend-url.railway.app/health`
   - Should return: `{"status":"healthy"}`

---

### Part 2: Deploy Frontend on Netlify (5 minutes)

#### Option A: Netlify Dashboard (Recommended)

1. **Go to Netlify**:
   - Visit https://app.netlify.com
   - Sign up/Login with GitHub

2. **Create New Site**:
   - Click "Add new site" → "Import an existing project"
   - Choose "Deploy with GitHub"
   - Authorize Netlify to access your GitHub
   - Select your repository

3. **Configure Build Settings**:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`

4. **Set Environment Variables**:
   - Click "Show advanced" or go to Site settings after creation
   - Click "Add environment variables"
   - Add:
     ```
     Variable: VITE_API_URL
     Value: https://your-backend-url.railway.app
     ```
   - (Use your actual Railway backend URL from Part 1)

5. **Deploy**:
   - Click "Deploy site"
   - Wait 3-5 minutes for build
   - **Copy your Netlify URL** (e.g., `https://your-site.netlify.app`)

#### Option B: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy from frontend directory
cd frontend
netlify deploy --prod

# Follow prompts:
# - Create & configure new site: Yes
# - Build command: npm run build
# - Publish directory: dist
```

---

### Part 3: Update Backend CORS (2 minutes)

1. **Go back to Railway Dashboard**
2. Click on your backend service
3. Go to **Variables** tab
4. Update `CORS_ORIGIN` with your actual Netlify URL:
   ```
   CORS_ORIGIN=https://your-site.netlify.app
   ```
5. Backend will redeploy automatically (1-2 minutes)

---

### Part 4: Test Your Deployment ✅

1. **Visit Your Netlify Site**:
   - Go to `https://your-site.netlify.app`
   - Dashboard should load

2. **Test Functionality**:
   - Select "North Goa" → Data should update
   - Select "South Goa" → Data should update
   - Charts should display
   - Open DevTools (F12) → No errors in console

3. **Test on Mobile**:
   - Open on your phone
   - Should be responsive and work smoothly

---

## 🔧 Configuration Files Included

Your project already has these files configured:

### `frontend/netlify.toml`
```toml
[build]
  publish = "dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18.0.0"
  VITE_API_URL = "your-backend-url"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### `frontend/public/_redirects`
```
/*    /index.html    200
```

These files ensure:
- ✅ SPA routing works correctly
- ✅ Direct URL access works
- ✅ No 404 errors on refresh

---

## 🔑 Environment Variables Reference

### Backend (Railway)
| Variable | Value | Example |
|----------|-------|---------|
| `NODE_ENV` | `production` | `production` |
| `CORS_ORIGIN` | Your Netlify URL | `https://your-site.netlify.app` |
| `MONGODB_URI` | Optional | `mongodb://...` |

### Frontend (Netlify)
| Variable | Value | Example |
|----------|-------|---------|
| `VITE_API_URL` | Your Railway backend URL | `https://backend-production-xxxx.up.railway.app` |

**⚠️ Important**: 
- Include `https://` protocol
- NO trailing slash
- Must be exact URLs

---

## 🐛 Troubleshooting

### Issue: "Page not found" on Netlify

**Symptoms**: 
- Homepage loads but other routes show 404
- Refresh on any page shows 404

**Solution**:
1. Check if `_redirects` file exists in `frontend/public/`
2. It should contain: `/*    /index.html    200`
3. Redeploy: `netlify deploy --prod` or trigger redeploy in dashboard

**Why**: React Router needs all routes to go to `index.html` for client-side routing.

---

### Issue: "Network Error" or "Failed to fetch"

**Symptoms**:
- Frontend loads but no data displays
- Console shows network errors
- API calls failing

**Solution**:
1. Verify `VITE_API_URL` is set in Netlify:
   - Go to Site settings → Environment variables
   - Check if `VITE_API_URL` exists
   - Verify it matches your Railway backend URL exactly
2. Check backend is running:
   - Visit: `https://your-backend-url.railway.app/health`
   - Should return `{"status":"healthy"}`
3. Rebuild frontend after setting env var:
   - Deploys → Trigger deploy → Deploy site

**Why**: Vite builds environment variables into the bundle at build time.

---

### Issue: CORS Error

**Symptoms**:
```
Access to fetch at 'https://backend...' from origin 'https://your-site.netlify.app' 
has been blocked by CORS policy
```

**Solution**:
1. Go to Railway → Backend service → Variables
2. Check `CORS_ORIGIN` value
3. It MUST match your Netlify URL exactly:
   - ✅ `https://your-site.netlify.app`
   - ❌ `https://your-site.netlify.app/`
   - ❌ `your-site.netlify.app`
   - ❌ `http://your-site.netlify.app`
4. Save and wait for backend redeploy

---

### Issue: Build Fails on Netlify

**Common Errors**:

**Error: "Command failed with exit code 1"**
- Check build logs for specific error
- Common cause: Missing dependencies
- Fix: Ensure `package.json` has all dependencies

**Error: "VITE_API_URL is not defined"**
- Environment variable not set
- Fix: Add `VITE_API_URL` in Site settings → Environment variables
- Redeploy after adding

**Error: "Directory not found: dist"**
- Wrong publish directory
- Fix: Set to `frontend/dist` or just `dist` if base is `frontend`

---

### Issue: Blank/White Screen

**Symptoms**:
- Site deploys successfully
- But shows blank white page

**Solution**:
1. Open DevTools (F12) → Console tab
2. Check for errors
3. Common causes:
   - JavaScript errors (check console)
   - Missing environment variables
   - Wrong asset paths
4. Fix:
   - Set `VITE_API_URL` environment variable
   - Clear cache and redeploy
   - Check if `dist` folder has `index.html`

---

## 🎨 Custom Domain (Optional)

### Add Custom Domain to Netlify:

1. **Buy Domain** (from Namecheap, GoDaddy, etc.)

2. **Add to Netlify**:
   - Site settings → Domain management
   - Click "Add custom domain"
   - Enter your domain (e.g., `mgnrega-goa.com`)

3. **Configure DNS**:
   - Add A record pointing to Netlify's load balancer:
     ```
     A @ 75.2.60.5
     ```
   - Or CNAME for subdomain:
     ```
     CNAME www your-site.netlify.app
     ```

4. **Update Backend CORS**:
   - Go to Railway → Backend → Variables
   - Update `CORS_ORIGIN` to your custom domain:
     ```
     CORS_ORIGIN=https://mgnrega-goa.com
     ```

5. **SSL Certificate**:
   - Netlify automatically provisions SSL
   - Wait 24 hours for DNS propagation
   - Certificate will be issued automatically

---

## 🔄 Continuous Deployment

Both Netlify and Railway auto-deploy when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Update dashboard"
git push origin main

# Both services will auto-deploy:
# - Netlify rebuilds frontend (2-3 min)
# - Railway redeploys backend (1-2 min)
```

---

## 💰 Cost Estimate

### Netlify Free Tier:
- ✅ 100 GB bandwidth/month
- ✅ 300 build minutes/month
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Unlimited sites
- **Cost**: $0/month

### Railway Free Tier:
- ✅ $5 credit/month
- ✅ Enough for backend (~$3/month)
- **Cost**: $0/month (covered by credit)

### Total Monthly Cost: $0 🎉

---

## 📊 Performance Optimization

### Frontend (Netlify):
- ✅ Global CDN (automatic)
- ✅ Brotli compression (automatic)
- ✅ HTTP/2 (automatic)
- ✅ Prerendering (configured)
- ✅ Asset optimization (configured)

### Backend (Railway):
- ✅ CSV data fallback (fast, no DB queries)
- ✅ In-memory caching (configured)
- ✅ Rate limiting (configured)
- ✅ Gzip compression (configured)

Expected Performance:
- First Load: < 3 seconds
- Subsequent Loads: < 1 second
- API Response: < 500ms

---

## 📈 Monitoring

### Netlify Analytics:
- Site settings → Analytics
- View traffic, bandwidth, performance

### Railway Logs:
- Service → Deployments → Logs
- Monitor errors and requests

### Browser DevTools:
- Network tab: Check API calls
- Console: Check for errors
- Lighthouse: Performance audit

---

## 🔐 Security Best Practices

1. **Environment Variables**:
   - Never commit `.env` files
   - Use Netlify/Railway dashboards only
   - Rotate API keys if exposed

2. **CORS**:
   - Set specific origin (your Netlify URL)
   - Never use `*` in production

3. **HTTPS**:
   - Always use HTTPS URLs
   - Both Netlify and Railway provide automatic SSL

4. **Headers**:
   - Already configured in `netlify.toml`
   - Includes security headers

---

## ✅ Deployment Checklist

### Pre-Deployment:
- [ ] Code pushed to GitHub
- [ ] `_redirects` file in `frontend/public/`
- [ ] `netlify.toml` configured
- [ ] Tested locally

### Backend (Railway):
- [ ] Service deployed
- [ ] Root directory set to `/backend`
- [ ] `NODE_ENV=production` set
- [ ] `CORS_ORIGIN` will be set after frontend
- [ ] Health endpoint works
- [ ] Backend URL copied

### Frontend (Netlify):
- [ ] Site created and connected to GitHub
- [ ] Base directory: `frontend`
- [ ] Build command: `npm run build`
- [ ] Publish directory: `frontend/dist`
- [ ] `VITE_API_URL` environment variable set
- [ ] Site deployed successfully
- [ ] Frontend URL copied

### Post-Deployment:
- [ ] Backend `CORS_ORIGIN` updated with Netlify URL
- [ ] Frontend loads without errors
- [ ] District selection works
- [ ] Charts display data
- [ ] No CORS errors
- [ ] Tested on mobile
- [ ] Performance is acceptable

---

## 🎯 Success Verification

Your deployment is successful when:

1. ✅ **Backend Health Check**:
   ```bash
   curl https://your-backend-url.railway.app/health
   # Response: {"status":"healthy"}
   ```

2. ✅ **Backend API**:
   ```bash
   curl https://your-backend-url.railway.app/api/districts
   # Response: {"success":true,"districts":["North Goa","South Goa"]}
   ```

3. ✅ **Frontend Loads**:
   - Visit `https://your-site.netlify.app`
   - Dashboard appears
   - No console errors

4. ✅ **Functionality**:
   - District selection updates data
   - Charts render correctly
   - Works on mobile

5. ✅ **No Errors**:
   - Browser console: No errors
   - Network tab: All requests succeed (200 status)

---

## 🆘 Getting Help

### Netlify Issues:
1. Check deploy logs: Site → Deploys → Deploy log
2. Netlify Forums: https://answers.netlify.com/
3. Netlify Docs: https://docs.netlify.com/

### Railway Issues:
1. Check logs: Service → Deployments → Logs
2. Railway Discord: https://discord.gg/railway
3. Railway Docs: https://docs.railway.app/

### Project Issues:
- Review `RAILWAY_QUICK_FIX.md`
- Check `CHECKLIST.md`
- Test locally first

---

## 🎉 Congratulations!

You now have:
- ✅ Frontend on Netlify (Fast, global CDN)
- ✅ Backend on Railway (Reliable, auto-scaling)
- ✅ Automatic deployments from GitHub
- ✅ HTTPS enabled on both
- ✅ Free tier hosting ($0/month)

**Share your deployment:**
- Frontend: `https://your-site.netlify.app`
- Backend: `https://your-backend-url.railway.app`

---

## 📝 Quick Commands Reference

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy to Netlify
cd frontend
netlify deploy --prod

# Check deployment status
netlify status

# Open Netlify dashboard
netlify open

# View logs
netlify logs

# Test build locally
npm run build
netlify dev
```

---

## 🔄 Update Workflow

When you need to update your site:

```bash
# Make changes to code
git add .
git commit -m "Your update message"
git push origin main

# Automatic deployment triggers:
# - Netlify rebuilds frontend (2-3 min)
# - Railway redeploys backend (if backend changed)

# Monitor deployments:
# - Netlify: https://app.netlify.com
# - Railway: https://railway.app/dashboard
```

---

## 💡 Pro Tips

1. **Preview Deploys**: Netlify creates preview deploys for pull requests
2. **Branch Deploys**: Deploy different branches to different URLs
3. **Functions**: Netlify supports serverless functions (for future expansion)
4. **Forms**: Netlify has built-in form handling (no backend needed)
5. **Split Testing**: A/B test different versions
6. **Analytics**: Enable Netlify Analytics for insights

---

**Last Updated**: December 2024  
**Version**: 1.0.0  
**Status**: ✅ Production Ready  
**Deployment Time**: 10-15 minutes  
**Monthly Cost**: $0 (Free tier)