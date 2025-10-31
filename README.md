# MGNREGA Goa Dashboard

A user-friendly dashboard for visualizing MGNREGA (Mahatma Gandhi National Rural Employment Guarantee Act) data for Goa state. Built with React, Node.js, and Express.

## 🚀 Quick Start

### Local Development

**Prerequisites:**
- Node.js 18+ 
- MongoDB (optional - falls back to CSV data)
- Git

**Setup:**

```bash
# Clone the repository
git clone <your-repo-url>
cd goa

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

**Run the application:**

```bash
# Terminal 1 - Start Backend
cd backend
npm run dev

# Terminal 2 - Start Frontend
cd frontend
npm run dev
```

Visit `http://localhost:3000` to view the dashboard.

## 🌐 Railway Deployment

Deploy this project to Railway in minutes! See [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md) for detailed instructions.

### Quick Deploy Steps:

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy on Railway:**
   - Visit [railway.app](https://railway.app/)
   - Create new project from GitHub repo
   - Deploy backend (root: `/backend`)
   - Deploy frontend (root: `/frontend`)

3. **Set Environment Variables:**
   
   **Backend:**
   ```
   NODE_ENV=production
   MONGODB_URI=<your-mongodb-uri>
   CORS_ORIGIN=<frontend-url>
   ```
   
   **Frontend:**
   ```
   NODE_ENV=production
   VITE_API_URL=<backend-url>
   ```

### Windows Users:
```bash
railway-deploy.bat
```

### Linux/Mac Users:
```bash
bash railway-deploy.sh
```

## 📁 Project Structure

```
goa/
├── backend/               # Express.js API server
│   ├── src/
│   │   ├── server.js     # Main server file
│   │   ├── routes/       # API routes
│   │   ├── controllers/  # Request handlers
│   │   ├── models/       # Database models
│   │   └── data/         # CSV data files
│   ├── package.json
│   └── railway.json      # Railway config
│
├── frontend/             # React + Vite application
│   ├── src/
│   │   ├── main.jsx      # Entry point
│   │   ├── pages/        # Page components
│   │   ├── components/   # Reusable components
│   │   ├── utils/        # Utilities & API client
│   │   └── styles/       # CSS files
│   ├── package.json
│   └── railway.json      # Railway config
│
├── RAILWAY_DEPLOYMENT.md # Detailed deployment guide
├── railway-deploy.bat    # Windows deployment helper
└── railway-deploy.sh     # Linux/Mac deployment helper
```

## 🎯 Features

- **Real-time Data Visualization**: Interactive charts and metrics
- **District Selection**: View data for North Goa or South Goa
- **Auto-location Detection**: Automatically detect user's district
- **Offline Support**: Works with cached data when offline
- **Mobile Responsive**: Optimized for all device sizes
- **Fallback Data**: CSV fallback when API is unavailable
- **Accessibility**: WCAG 2.1 AA compliant

## 🔧 Technology Stack

**Frontend:**
- React 18
- Vite
- Chart.js
- Tailwind CSS
- Axios

**Backend:**
- Node.js 18+
- Express.js
- MongoDB (optional)
- CSV Parser

## 📊 API Endpoints

- `GET /health` - Health check
- `GET /api` - All MGNREGA data
- `GET /api/districts` - List of districts
- `GET /api/data/:district` - District-specific data
- `POST /api/cache/clear` - Clear cache

## 🧪 Testing

See the testing section below for comprehensive testing procedures.

---

# Step 10: Comprehensive Testing Guide
## MGNREGA Goa Dashboard - Complete Testing Suite

This guide provides comprehensive testing procedures for the MGNREGA Goa Dashboard, covering backend API testing, frontend E2E testing, and integrated system validation.

## 🎯 Testing Overview

### Test Categories
1. **Backend API Testing** - All routes, error handling, CSV fallback
2. **Frontend E2E Testing** - User interactions, auto-detection, offline features
3. **Integration Testing** - End-to-end data flow validation
4. **Performance Testing** - Load times, responsiveness, memory usage
5. **Accessibility Testing** - Screen readers, keyboard navigation, WCAG compliance

## 🏗️ Prerequisites

### Required Dependencies
```bash
# Backend testing dependencies
cd backend
npm install axios

# Frontend testing dependencies  
cd ../frontend
npm install playwright

# Install browsers for E2E testing
npx playwright install
```

### Environment Setup
```bash
# Backend server
export API_URL=http://localhost:5000
export MONGODB_URI=mongodb://localhost:27017/mgnrega-goa

# Frontend server
export FRONTEND_URL=http://localhost:5173
export VITE_API_URL=http://localhost:5000
```

## 🚀 Quick Start Testing

### 1. Start Both Servers
```bash
# Terminal 1: Start Backend
cd backend
npm run dev

# Terminal 2: Start Frontend
cd frontend
npm run dev
```

### 2. Run Complete Test Suite
```bash
# Terminal 3: Run all tests
cd goa
node run-all-tests.js
```

## 📊 Backend API Testing

### Test Script: `backend/test-api-comprehensive.js`

#### Available Routes Testing
```bash
# Run backend tests
cd backend
node test-api-comprehensive.js
```

#### Test Coverage
- ✅ `/health` - Health check endpoint
- ✅ `/api` - Main data endpoint with fallback
- ✅ `/api/districts` - Districts list endpoint
- ✅ `/api/data/GA01` - North Goa data
- ✅ `/api/data/GA02` - South Goa data
- ✅ `/api/data/north-goa` - Alternative format
- ✅ `/api/data/south-goa` - Alternative format
- ✅ Error handling for invalid districts
- ✅ CSV fallback mechanism
- ✅ Data consistency validation
- ✅ Performance benchmarking

#### Expected Results
```json
{
  "summary": {
    "total": 25,
    "passed": 23,
    "failed": 0,
    "skipped": 2,
    "passRate": 92.0,
    "overallStatus": "PASSED"
  }
}
```

#### CSV Fallback Testing
```bash
# Test with API disabled
export DISABLE_EXTERNAL_API=true
node test-api-comprehensive.js
```

Should show:
- ✅ Data source: `csv` or `fallback`
- ✅ Valid data structure maintained
- ✅ Error-free operation
- ✅ Appropriate response times

## 🖥️ Frontend E2E Testing

### Test Script: `frontend/test-frontend-e2e.js`

#### Running E2E Tests
```bash
# Run with different browsers
cd frontend

# Chromium (default)
node test-frontend-e2e.js

# Firefox
node test-frontend-e2e.js firefox

# Safari (WebKit)
node test-frontend-e2e.js webkit
```

#### Test Coverage

**1. Basic Functionality**
- ✅ Page loads correctly
- ✅ Title and headers present
- ✅ No JavaScript errors
- ✅ Loading states resolve

**2. District Selection & Auto-Detection**
- ✅ District dropdown present
- ✅ Options include North & South Goa
- ✅ Selection triggers data update
- ✅ Auto-detect button functional
- ✅ Location permission handling
- ✅ Coordinate mapping accuracy

**3. Metric Cards**
- ✅ At least 3 cards displayed
- ✅ Numeric values present
- ✅ Cards update on district change
- ✅ Proper formatting (currency, numbers)
- ✅ Interactive hover effects

**4. Charts and Visualization**
- ✅ Chart containers present
- ✅ Data points rendered
- ✅ Trend lines visible
- ✅ Legends and labels
- ✅ Responsive on mobile

**5. Offline Functionality**
- ✅ Works without internet
- ✅ Cached data displayed
- ✅ Offline indicator shown
- ✅ Graceful error handling
- ✅ Sync on reconnection

**6. API Integration**
- ✅ API calls made on load
- ✅ Refresh functionality
- ✅ Error handling with fallbacks
- ✅ District change triggers updates

**7. Responsive Design**
- ✅ Mobile viewport (375px)
- ✅ Tablet viewport (768px)
- ✅ Desktop viewport (1920px)
- ✅ No horizontal scrolling
- ✅ Content accessibility

**8. Accessibility**
- ✅ Keyboard navigation
- ✅ ARIA labels present
- ✅ Image alt text
- ✅ Heading hierarchy
- ✅ Color contrast

**9. Performance**
- ✅ Page load < 10 seconds
- ✅ DOM ready < 3 seconds
- ✅ Memory usage reasonable
- ✅ No memory leaks

**10. Error Handling**
- ✅ API failure fallbacks
- ✅ User-friendly error messages
- ✅ Fallback data display
- ✅ Network error recovery

## 🔄 Integration Testing

### Full System Test Flow

1. **Data Flow Validation**
   ```bash
   # Trace data from API to UI
   curl http://localhost:5000/api | jq '.count'
   # Should match metric cards in frontend
   ```

2. **District Auto-Detection Flow**
   ```javascript
   // Test coordinates → district mapping
   const testCoords = [
     { lat: 15.55, lng: 73.83, expected: 'North Goa' },
     { lat: 15.25, lng: 74.00, expected: 'South Goa' }
   ];
   ```

3. **Offline-Online Transition**
   ```bash
   # Test sequence:
   # 1. Load page online
   # 2. Go offline
   # 3. Verify cached data
   # 4. Come back online
   # 5. Verify sync
   ```

## 🎯 Manual Testing Checklist

### Critical User Flows

**Flow 1: First Time User**
- [ ] Visit dashboard
- [ ] Allow location permission
- [ ] District auto-detected
- [ ] Data loads for detected district
- [ ] All metric cards show values
- [ ] Chart displays trend data

**Flow 2: Manual District Selection**
- [ ] Open district dropdown
- [ ] Select "North Goa"
- [ ] Data updates within 3 seconds
- [ ] Switch to "South Goa"
- [ ] Data changes accordingly
- [ ] Charts reflect new district

**Flow 3: Offline Usage**
- [ ] Load page normally
- [ ] Disable network
- [ ] Refresh page
- [ ] Data still displays
- [ ] Offline indicator visible
- [ ] Re-enable network
- [ ] Data syncs automatically

**Flow 4: Error Recovery**
- [ ] Block API requests
- [ ] Load page
- [ ] Fallback data shows
- [ ] Error message friendly
- [ ] Restore API access
- [ ] Data refreshes

**Flow 5: Mobile Experience**
- [ ] Open on mobile device
- [ ] Touch navigation works
- [ ] Cards stack vertically
- [ ] Charts remain readable
- [ ] Auto-detect works on mobile

## 📱 Device Testing Matrix

### Desktop Browsers
- [ ] Chrome 90+
- [ ] Firefox 88+
- [ ] Safari 14+
- [ ] Edge 90+

### Mobile Devices
- [ ] iPhone (Safari)
- [ ] Android (Chrome)
- [ ] iPad (Safari)
- [ ] Android Tablet

### Screen Sizes
- [ ] 320px (Small mobile)
- [ ] 375px (Mobile)
- [ ] 768px (Tablet)
- [ ] 1024px (Small desktop)
- [ ] 1920px (Large desktop)

## 🚨 Known Issues & Expected Behaviors

### Location Detection
- **Issue**: Permission denied on first visit
- **Expected**: Manual district selection still works
- **Workaround**: Clear browser data to re-test permissions

### API Rate Limiting
- **Issue**: Too many requests during testing
- **Expected**: Graceful fallback to cached data
- **Workaround**: Wait 60 seconds between test runs

### CSV Fallback
- **Issue**: External API timeout
- **Expected**: Automatic fallback to CSV data
- **Indicator**: `source: "csv"` in API responses

## 📊 Performance Benchmarks

### Target Metrics
```
Page Load Time: < 3 seconds
First Contentful Paint: < 1.5 seconds
Time to Interactive: < 3 seconds
API Response Time: < 2 seconds
Chart Render Time: < 1 second
Location Detection: < 10 seconds
```

### Memory Usage
```
JavaScript Heap: < 50MB
DOM Nodes: < 2000
Event Listeners: < 100
```

## 🔍 Debugging Failed Tests

### Backend Test Failures

**1. Connection Refused**
```bash
Error: connect ECONNREFUSED 127.0.0.1:5000
```
**Solution**: Ensure backend server is running
```bash
cd backend && npm run dev
```

**2. CSV File Not Found**
```bash
Error: ENOENT: no such file or directory 'mgnrega_goa_data.csv'
```
**Solution**: Check CSV file location
```bash
find . -name "*.csv" -type f
```

**3. MongoDB Connection Error**
```bash
Error: MongoNetworkError
```
**Solution**: Start MongoDB or disable caching
```bash
export DISABLE_MONGODB=true
```

### Frontend Test Failures

**1. Element Not Found**
```bash
Error: waiting for selector "select" failed: timeout 30000ms exceeded
```
**Solution**: Check if components are rendering
- Verify frontend server is running
- Check console for JavaScript errors
- Ensure API is returning data

**2. Location Permission Denied**
```bash
Error: Geolocation request denied
```
**Solution**: This is expected behavior
- Tests should handle gracefully
- Manual district selection should work

**3. Chart Not Rendering**
```bash
Error: Chart data points not found
```
**Solution**: Check data flow
- Verify API returns data
- Check chart component implementation
- Ensure chart library is loaded

## 📈 Test Results Analysis

### Interpreting Results

**Pass Rate > 90%**: Excellent - Ready for production
**Pass Rate 80-90%**: Good - Minor issues to address
**Pass Rate 60-80%**: Needs work - Major issues present
**Pass Rate < 60%**: Not ready - Significant problems

### Common Failure Patterns

1. **Network-Related Failures**: Often environment-specific
2. **Timing Issues**: May need increased timeouts
3. **Permission Failures**: Expected in automated testing
4. **Data Consistency**: Check API and CSV alignment

## 🚀 Continuous Integration

### GitHub Actions Setup
```yaml
name: Test MGNREGA Dashboard

on: [push, pull_request]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: cd backend && npm ci
      - run: cd backend && node test-api-comprehensive.js

  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: cd frontend && npm ci
      - run: cd frontend && npx playwright install
      - run: cd frontend && node test-frontend-e2e.js
```

## 📝 Test Reporting

### Generated Reports
- `backend/test-report.json` - Backend test results
- `frontend/frontend-test-report.json` - Frontend test results
- `screenshots/` - Failure screenshots
- `master-test-report.json` - Combined results

### Report Analysis
```bash
# View test summary
cat master-test-report.json | jq '.summary'

# List failed tests
cat master-test-report.json | jq '.errors[]'

# Check performance metrics
cat frontend-test-report.json | jq '.performance'
```

## 🎯 Success Criteria

### Minimum Requirements for Production
- [ ] Backend tests: 90%+ pass rate
- [ ] Frontend tests: 85%+ pass rate
- [ ] All critical user flows work
- [ ] Mobile experience functional
- [ ] Offline capability working
- [ ] Auto-detection implemented
- [ ] Accessibility compliance
- [ ] Performance targets met

### Quality Gates
1. **Functionality**: All core features work
2. **Reliability**: Graceful error handling
3. **Performance**: Meets speed targets
4. **Usability**: Intuitive user experience
5. **Accessibility**: WCAG 2.1 AA compliance
6. **Compatibility**: Works across browsers/devices

## 🆘 Support & Troubleshooting

### Getting Help
1. Check this guide first
2. Review error logs and reports
3. Run individual test suites
4. Test in different environments
5. Check network and server status

### Common Solutions
- Restart servers
- Clear browser cache
- Check environment variables
- Update dependencies
- Verify file permissions

---

**Last Updated**: December 2024  
**Version**: 1.0  
**Status**: Production Ready Testing Suite
