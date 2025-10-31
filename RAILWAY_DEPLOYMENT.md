# Railway Deployment Guide - MGNREGA Goa Dashboard

This guide provides step-by-step instructions for deploying the MGNREGA Goa Dashboard on Railway.app.

## 📋 Prerequisites

- A [Railway.app](https://railway.app/) account (free tier available)
- GitHub account (for connecting your repository)
- Git installed on your local machine

## 🚀 Deployment Steps

### Step 1: Prepare Your Repository

1. **Initialize Git repository** (if not already done):
```bash
git init
git add .
git commit -m "Initial commit for Railway deployment"
```

2. **Push to GitHub**:
```bash
# Create a new repository on GitHub first
git remote add origin https://github.com/YOUR_USERNAME/mgnrega-goa-dashboard.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy Backend on Railway

1. **Login to Railway**:
   - Go to [railway.app](https://railway.app/)
   - Sign in with your GitHub account

2. **Create New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `mgnrega-goa-dashboard` repository

3. **Configure Backend Service**:
   - Railway will auto-detect your backend
   - Click on the backend service
   - Go to "Settings" tab

4. **Set Root Directory**:
   - In Settings → "Root Directory": `/backend`
   - Click "Save Changes"

5. **Configure Environment Variables**:
   - Go to "Variables" tab
   - Add the following variables:

   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string_here
   CORS_ORIGIN=https://your-frontend-url.railway.app
   ```

   **Optional API Variables** (if using external API):
   ```
   API_KEY=your_api_key_here
   RESOURCE_ID=your_resource_id_here
   ```

6. **Deploy**:
   - Railway will automatically deploy after adding variables
   - Wait for deployment to complete (2-3 minutes)
   - Copy the generated URL (e.g., `https://backend-production-xxxx.up.railway.app`)

### Step 3: Deploy Frontend on Railway

1. **Add Frontend Service**:
   - In the same Railway project, click "New"
   - Select "GitHub Repo"
   - Choose the same repository

2. **Configure Frontend Service**:
   - Go to "Settings" tab
   - Set Root Directory: `/frontend`

3. **Set Environment Variables**:
   - Go to "Variables" tab
   - Add:

   ```
   NODE_ENV=production
   VITE_API_URL=https://your-backend-url.railway.app
   ```

   Replace `your-backend-url.railway.app` with the backend URL from Step 2.

4. **Configure Build Settings**:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run preview -- --host 0.0.0.0 --port $PORT`
   - Railway should auto-detect these from `railway.json`

5. **Deploy**:
   - Click "Deploy"
   - Wait for build and deployment (3-5 minutes)
   - Your frontend will be live!

### Step 4: Add MongoDB Database (Optional but Recommended)

1. **Add MongoDB Plugin**:
   - In your Railway project, click "New"
   - Select "Database" → "Add MongoDB"
   - Railway will provision a MongoDB instance

2. **Get Connection String**:
   - Click on the MongoDB service
   - Go to "Connect" tab
   - Copy the `MONGO_URL` value

3. **Update Backend Variables**:
   - Go back to backend service
   - Update `MONGODB_URI` with the copied connection string
   - The backend will automatically redeploy

### Step 5: Update CORS Settings

1. **Get Frontend URL**:
   - Go to your frontend service
   - Copy the deployment URL (e.g., `https://frontend-production-xxxx.up.railway.app`)

2. **Update Backend CORS**:
   - Go to backend service → Variables
   - Update `CORS_ORIGIN` with your frontend URL
   - Save (will trigger redeploy)

## 🔧 Configuration Details

### Backend Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NODE_ENV` | Yes | Environment mode | `production` |
| `PORT` | Auto | Railway sets this automatically | `5000` |
| `MONGODB_URI` | Optional | MongoDB connection string | `mongodb://...` |
| `CORS_ORIGIN` | Yes | Frontend URL for CORS | `https://frontend.railway.app` |
| `API_KEY` | Optional | External API key | `your-api-key` |
| `RESOURCE_ID` | Optional | External API resource ID | `resource-id` |

### Frontend Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NODE_ENV` | Yes | Environment mode | `production` |
| `VITE_API_URL` | Yes | Backend API URL | `https://backend.railway.app` |

## 🐛 Troubleshooting

### Backend Issues

**Issue: Backend not starting**
```bash
Solution:
1. Check logs in Railway dashboard
2. Verify environment variables are set correctly
3. Ensure MongoDB connection string is valid (if using)
4. Check that PORT is not hardcoded in server.js
```

**Issue: API returns 500 errors**
```bash
Solution:
1. Backend falls back to CSV data automatically
2. Check if MongoDB is connected (optional)
3. Verify CSV file exists at backend/src/data/goa_mgnrega.csv
4. Check backend logs for specific errors
```

**Issue: CORS errors**
```bash
Solution:
1. Update CORS_ORIGIN in backend variables
2. Must match your frontend URL exactly
3. Include https:// protocol
4. No trailing slash
```

### Frontend Issues

**Issue: Frontend shows "Network Error"**
```bash
Solution:
1. Verify VITE_API_URL is set correctly
2. Must point to backend Railway URL
3. Include https:// protocol
4. No trailing slash
5. Backend must be running
```

**Issue: Build fails**
```bash
Solution:
1. Check if all dependencies are in package.json
2. Verify Node version compatibility (18+)
3. Clear Railway build cache and redeploy
4. Check build logs for specific errors
```

**Issue: White screen after deployment**
```bash
Solution:
1. Check browser console for errors
2. Verify VITE_API_URL environment variable
3. Check if backend is responding
4. Clear browser cache
5. Try incognito/private browsing
```

## 🔍 Health Checks

### Backend Health Check
```bash
curl https://your-backend-url.railway.app/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 12345.67,
  "services": {
    "database": "connected",
    "api": "healthy"
  }
}
```

### Frontend Health Check
Just visit: `https://your-frontend-url.railway.app`

Should display the dashboard with data.

## 🚦 Deployment Verification Checklist

- [ ] Backend deployed successfully
- [ ] Backend health endpoint returns 200
- [ ] Frontend deployed successfully
- [ ] Frontend loads without errors
- [ ] API calls from frontend to backend work
- [ ] District selection updates data
- [ ] Charts render correctly
- [ ] Mobile responsive design works
- [ ] No console errors in browser
- [ ] CORS configured correctly

## 📊 Monitoring

### Railway Dashboard
- View deployment logs
- Monitor resource usage
- Check service health
- View build history

### Useful Commands

**View Backend Logs**:
```bash
# In Railway dashboard
Backend Service → Deployments → Latest → Logs
```

**View Frontend Logs**:
```bash
# In Railway dashboard
Frontend Service → Deployments → Latest → Logs
```

**Redeploy Services**:
```bash
# In Railway dashboard
Service → Settings → Redeploy
```

## 🔄 Continuous Deployment

Railway automatically redeploys when you push to your GitHub repository:

1. Make changes locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update feature"
   git push origin main
   ```
3. Railway auto-detects changes and redeploys
4. Monitor deployment in Railway dashboard

## 💰 Cost Estimation

**Free Tier** (Railway Starter Plan):
- $5 free credit per month
- Enough for:
  - 1 Backend service (low traffic)
  - 1 Frontend service
  - 1 Small MongoDB database
- Good for development and testing

**Pro Plan** ($20/month):
- More resources
- Better performance
- Custom domains
- Priority support

## 🌐 Custom Domain (Optional)

1. **Get Domain Settings**:
   - Railway Service → Settings → Domains
   - Click "Add Domain"

2. **Add Custom Domain**:
   - Enter your domain (e.g., `dashboard.yourdomain.com`)
   - Railway provides DNS records

3. **Update DNS**:
   - Add CNAME record at your DNS provider
   - Point to Railway's provided URL
   - Wait for DNS propagation (5-30 minutes)

4. **Update Environment Variables**:
   - Update `CORS_ORIGIN` in backend
   - Update `VITE_API_URL` in frontend

## 🔐 Security Best Practices

1. **Environment Variables**:
   - Never commit `.env` files
   - Use Railway's environment variable management
   - Rotate API keys regularly

2. **CORS Configuration**:
   - Set specific origins, not `*`
   - Update when changing domains

3. **MongoDB**:
   - Use strong passwords
   - Enable authentication
   - Restrict network access

4. **Rate Limiting**:
   - Already configured in backend
   - Adjust limits as needed

## 📚 Additional Resources

- [Railway Documentation](https://docs.railway.app/)
- [Railway Discord Community](https://discord.gg/railway)
- [Railway Blog](https://blog.railway.app/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Alternative DB hosting)

## 🆘 Getting Help

If you encounter issues:

1. Check Railway logs first
2. Review this troubleshooting guide
3. Search Railway documentation
4. Ask in Railway Discord community
5. Check GitHub issues

## 📝 Quick Deployment Summary

```bash
# 1. Prepare and push code
git add .
git commit -m "Ready for Railway deployment"
git push origin main

# 2. Railway Setup
# - Create project from GitHub repo
# - Deploy backend (root: /backend)
# - Deploy frontend (root: /frontend)
# - Add MongoDB (optional)

# 3. Set Environment Variables
# Backend: NODE_ENV, MONGODB_URI, CORS_ORIGIN
# Frontend: NODE_ENV, VITE_API_URL

# 4. Verify Deployment
# - Check backend health endpoint
# - Test frontend application
# - Verify API integration
```

## ✅ Success!

Your MGNREGA Goa Dashboard should now be live on Railway! 🎉

**Share your deployed URLs**:
- Frontend: `https://your-frontend.railway.app`
- Backend API: `https://your-backend.railway.app`

---

**Last Updated**: December 2024  
**Version**: 1.0.0  
**Status**: Production Ready