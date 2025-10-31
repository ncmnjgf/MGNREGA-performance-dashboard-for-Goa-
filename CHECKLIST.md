# ✅ Pre-Deployment Checklist

Use this checklist to ensure your MGNREGA Goa Dashboard is ready for Railway deployment.

## 📦 Prerequisites

- [ ] Node.js 18 or higher installed
- [ ] Git installed and configured
- [ ] GitHub account created
- [ ] Railway account created (free tier available)
- [ ] Code editor installed (VS Code, etc.)

## 🔍 Local Verification

### Backend
- [ ] Navigate to `backend` folder
- [ ] Run `npm install` successfully
- [ ] File `src/data/goa_mgnrega.csv` exists
- [ ] File `src/server.js` exists
- [ ] File `railway.json` exists
- [ ] File `nixpacks.toml` exists
- [ ] Test: `npm start` runs without errors
- [ ] Test: Visit `http://localhost:5000/health` shows "healthy"
- [ ] Test: Visit `http://localhost:5000/api/districts` returns data

### Frontend
- [ ] Navigate to `frontend` folder
- [ ] Run `npm install` successfully
- [ ] File `src/main.jsx` exists
- [ ] File `railway.json` exists
- [ ] File `nixpacks.toml` exists
- [ ] Test: `npm run dev` runs without errors
- [ ] Test: Visit `http://localhost:3000` loads dashboard
- [ ] Test: District selection works
- [ ] Test: Charts display data

## 📝 Git Repository

- [ ] Git repository initialized (`git init`)
- [ ] `.gitignore` file exists
- [ ] All files added to Git (`git add .`)
- [ ] Initial commit created (`git commit -m "Initial commit"`)
- [ ] GitHub repository created
- [ ] Remote added (`git remote add origin ...`)
- [ ] Code pushed to GitHub (`git push -u origin main`)

## 🌐 Railway Setup

### Initial Configuration
- [ ] Logged into Railway dashboard
- [ ] New project created
- [ ] Repository connected to Railway

### Backend Service
- [ ] Backend service created from GitHub repo
- [ ] Root directory set to `/backend`
- [ ] Environment variables configured:
  - [ ] `NODE_ENV=production`
  - [ ] `CORS_ORIGIN=<will-update-after-frontend>`
  - [ ] `MONGODB_URI=<optional>`
- [ ] Deployment succeeded (check logs)
- [ ] Backend URL copied (e.g., `https://backend-xxx.railway.app`)
- [ ] Health endpoint works: `<backend-url>/health`
- [ ] API endpoint works: `<backend-url>/api/districts`

### Frontend Service
- [ ] Frontend service created from GitHub repo
- [ ] Root directory set to `/frontend`
- [ ] Environment variables configured:
  - [ ] `NODE_ENV=production`
  - [ ] `VITE_API_URL=<backend-url-from-above>`
- [ ] Deployment succeeded (check logs)
- [ ] Frontend URL copied (e.g., `https://frontend-xxx.railway.app`)
- [ ] Frontend loads without errors
- [ ] No console errors in browser DevTools

### Final Configuration
- [ ] Backend `CORS_ORIGIN` updated with frontend URL
- [ ] Backend redeployed with new CORS setting
- [ ] Both services running and healthy

## 🧪 Deployment Testing

### API Connectivity
- [ ] Frontend can fetch districts list
- [ ] District selection triggers API call
- [ ] Data displays correctly for North Goa
- [ ] Data displays correctly for South Goa
- [ ] No CORS errors in browser console

### UI/UX Testing
- [ ] Dashboard loads within 5 seconds
- [ ] All metric cards show values
- [ ] Charts render correctly
- [ ] No missing images or broken assets
- [ ] Loading states display properly
- [ ] Error messages are user-friendly

### Responsive Design
- [ ] Test on desktop (1920px width)
- [ ] Test on tablet (768px width)
- [ ] Test on mobile (375px width)
- [ ] No horizontal scrolling on mobile
- [ ] Touch interactions work on mobile
- [ ] Navigation is accessible

### Browser Compatibility
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest, if available)
- [ ] Mobile browsers (Chrome, Safari)

### Performance
- [ ] Page loads in < 5 seconds
- [ ] No memory leaks (check DevTools)
- [ ] Smooth scrolling
- [ ] Chart animations work smoothly

## 🔐 Security

- [ ] `.env` files NOT committed to Git
- [ ] Environment variables set in Railway only
- [ ] No API keys or secrets in code
- [ ] CORS configured for specific origins only
- [ ] HTTPS enabled (Railway default)

## 📊 Monitoring

- [ ] Railway deployment logs accessible
- [ ] Backend logs show no errors
- [ ] Frontend logs show no errors
- [ ] Health check endpoint monitored
- [ ] Error tracking set up (optional)

## 📖 Documentation

- [ ] README.md is up to date
- [ ] RAILWAY_DEPLOYMENT.md reviewed
- [ ] Environment variables documented
- [ ] Deployment URLs documented
- [ ] Troubleshooting guide available

## 🎯 Final Verification

### Critical Path Test
1. [ ] Visit frontend URL
2. [ ] Dashboard loads with default district
3. [ ] Select "North Goa" from dropdown
4. [ ] Data updates and charts refresh
5. [ ] Select "South Goa" from dropdown
6. [ ] Data updates and charts refresh
7. [ ] Open browser DevTools
8. [ ] Verify no console errors
9. [ ] Check Network tab for successful API calls
10. [ ] Test on mobile device

### Data Validation
- [ ] Person days values are realistic (> 0)
- [ ] Household numbers make sense
- [ ] Funds spent show proper currency format
- [ ] Charts display trend data correctly
- [ ] Month/year labels are accurate

## 🚀 Go-Live Checklist

Before sharing your deployment:

- [ ] All above items completed
- [ ] Tested by at least one other person
- [ ] Performance is acceptable
- [ ] No critical bugs found
- [ ] Backup of working code committed
- [ ] Railway billing understood
- [ ] Support plan in place

## 📝 Post-Deployment

- [ ] Monitor Railway usage/costs
- [ ] Check logs regularly for errors
- [ ] Plan for updates and maintenance
- [ ] Document any issues encountered
- [ ] Gather user feedback
- [ ] Plan next iteration

## 🎉 Deployment Complete!

Once all items are checked, your deployment is complete!

**Your Live URLs:**
- Backend: `https://your-backend.railway.app`
- Frontend: `https://your-frontend.railway.app`

**Share your success:**
- [ ] Demo to stakeholders
- [ ] Share URL with users
- [ ] Update project documentation
- [ ] Celebrate! 🎊

---

## 📞 Support

If any checklist item fails:

1. Check `RAILWAY_DEPLOYMENT.md` troubleshooting section
2. Review Railway deployment logs
3. Test locally to isolate the issue
4. Consult Railway documentation
5. Ask in Railway Discord community

---

**Last Updated**: December 2024  
**Version**: 1.0.0