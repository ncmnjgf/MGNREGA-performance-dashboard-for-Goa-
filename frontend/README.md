# MGNREGA Goa Dashboard - Frontend

A modern, accessible, and user-friendly React application for tracking MGNREGA employment data in Goa state. Built with simplicity and low-literacy users in mind.

## 🚀 Quick Start

```bash
# Clone and setup
cd goa/frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

## ✨ Features

### 🎯 User-Friendly Design
- **Large Fonts**: 18px+ for better readability
- **Simple Language**: "Total Work Done" instead of technical jargon
- **Clear Icons**: Visual indicators for all metrics
- **Mobile-First**: Optimized for smartphones and tablets
- **High Contrast**: Meets WCAG 2.1 AA accessibility standards

### 📱 Responsive Layout
- **Mobile**: Single column, touch-friendly
- **Tablet**: 2-column grid for metrics
- **Desktop**: Full dashboard with comparison charts

### 🔧 Smart Features
- **Auto-detect Location**: GPS-based district selection
- **Offline Support**: Works without internet connection
- **Error Handling**: Graceful fallbacks for all scenarios
- **Performance**: <3 second load times

### 📊 Data Visualization
- **Metric Cards**: Key performance indicators
- **Trend Charts**: Monthly progress over time
- **District Comparison**: North vs South Goa performance
- **Real-time Updates**: Data refreshes automatically

## 🏗️ Architecture

### Technology Stack
```
React 18          - Modern React with hooks
Vite              - Fast build tool and dev server
Tailwind CSS      - Utility-first styling
Lucide Icons      - Beautiful, accessible icons
Chart.js          - Interactive charts
Axios             - HTTP client for API calls
React Router      - Client-side routing
```

### Project Structure
```
src/
├── components/
│   ├── ui/                 # Base UI components
│   │   ├── Button.jsx      # Accessible button component
│   │   ├── Card.jsx        # Card container component
│   │   └── Icon.jsx        # Icon wrapper with fallbacks
│   ├── dashboard/          # Dashboard-specific components
│   │   ├── MetricCard.jsx  # KPI display cards
│   │   ├── TrendChart.jsx  # Monthly trend visualization
│   │   └── DistrictSelector.jsx # Location selection
│   ├── layout/             # Layout components
│   │   ├── Layout.jsx      # Main page layout
│   │   ├── Header.jsx      # Navigation header
│   │   └── Footer.jsx      # Page footer
│   └── common/             # Shared components
│       ├── ErrorBoundary.jsx # Error handling
│       └── LoadingSpinner.jsx # Loading states
├── pages/                  # Page components
│   ├── Dashboard.jsx       # Main dashboard page
│   ├── About.jsx          # Information page
│   └── Help.jsx           # Support page
├── hooks/                  # Custom React hooks
│   ├── useApi.js          # API data fetching
│   └── useLocation.js     # Location detection
├── utils/                  # Utility functions
│   ├── api.js             # API client and formatters
│   └── constants.js       # App configuration
└── styles/                 # Global styles
    └── globals.css        # Tailwind + custom CSS
```

## 🎨 Design System

### Color Palette
```css
Primary Green:  #15803d  /* Government theme */
Trust Blue:     #1e40af  /* Reliability */
Alert Orange:   #ea580c  /* Attention */
Success:        #16a34a  /* Positive metrics */
Warning:        #ca8a04  /* Caution */
Error:          #dc2626  /* Problems */
```

### Typography Scale
```css
Body Text:      18px     /* Better readability */
Headings:       24px+    /* Clear hierarchy */
Numbers:        32px     /* Prominent metrics */
Small Text:     14px     /* Secondary info */
```

### Component Library
- **MetricCard**: KPI display with icons and trends
- **DistrictSelector**: Location picker with GPS
- **TrendChart**: Line chart for time series data
- **Button**: Accessible buttons with loading states
- **Card**: Container with hover effects
- **Icon**: SVG icons with screen reader support

## 📱 Accessibility

### WCAG 2.1 AA Compliance
- ✅ **Color Contrast**: 4.5:1 minimum ratio
- ✅ **Font Size**: 18px minimum for body text
- ✅ **Touch Targets**: 44px minimum size
- ✅ **Alt Text**: All images and icons
- ✅ **Keyboard Navigation**: Full keyboard support
- ✅ **Screen Reader**: Semantic HTML and ARIA labels

### Low-Literacy Design
- **Simple Language**: 5th grade reading level
- **Visual Hierarchy**: Clear information structure
- **Progressive Disclosure**: Essential info first
- **Consistent Patterns**: Predictable interactions

## 🔌 API Integration

### Backend Connection
```javascript
// API Configuration
const API_BASE_URL = 'http://localhost:5000'

// Main Endpoints
GET /api                    # All MGNREGA data
GET /api/districts          # District list
GET /api/data/:district     # District-specific data
```

### Data Processing
```javascript
// Smart Fallback Chain
API Data → CSV Fallback → Mock Data → Error State

// Number Formatting
125500 → "1.25 Lakh"
2500000 → "₹2.5 Crores"
```

## 🚀 Development

### Setup Environment
```bash
# 1. Install Node.js 18+
node --version

# 2. Clone repository
git clone <repo-url>
cd goa/frontend

# 3. Install dependencies
npm install

# 4. Create environment file
cp .env.example .env

# 5. Start development
npm run dev
```

### Available Scripts
```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
npm run lint        # Check code quality
```

### Environment Variables
```env
# .env file
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=MGNREGA Goa Dashboard
VITE_ENABLE_ANALYTICS=false
```

## 🧪 Testing

### Manual Testing Checklist
- [ ] Dashboard loads without errors
- [ ] District selection works
- [ ] Metrics display correctly
- [ ] Charts render properly
- [ ] Mobile layout responsive
- [ ] Accessibility with screen reader
- [ ] Offline functionality
- [ ] Error states handled

### Browser Support
- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+
- ✅ Mobile browsers

## 📊 Performance

### Optimization Features
- **Code Splitting**: Route-based chunks
- **Image Optimization**: WebP format, lazy loading
- **Caching**: Service worker for offline support
- **Bundle Size**: <200KB initial bundle
- **Loading**: <3 seconds on 3G

### Performance Metrics
- **First Contentful Paint**: <1.5s
- **Largest Contentful Paint**: <2.5s
- **First Input Delay**: <100ms
- **Cumulative Layout Shift**: <0.1

## 🌐 Deployment

### Production Build
```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to static hosting
# (Vercel, Netlify, GitHub Pages)
```

### Environment Setup
```env
# Production .env
VITE_API_URL=https://api.mgnrega-goa.gov.in
VITE_ENABLE_ANALYTICS=true
VITE_SENTRY_DSN=your_sentry_dsn
```

### Hosting Options
- **Vercel**: Automatic deployments from Git
- **Netlify**: Static site hosting with forms
- **GitHub Pages**: Free hosting for public repos
- **AWS S3**: Scalable static hosting

## 🔧 Customization

### Adding New Metrics
```javascript
// 1. Define in constants.js
export const METRICS = {
  NEW_METRIC: {
    key: 'new_metric',
    title: 'New Metric Title',
    icon: '📈',
    color: 'primary',
    format: 'number'
  }
}

// 2. Add to Dashboard.jsx
<MetricCard
  type="new_metric"
  title={METRICS.NEW_METRIC.title}
  value={data.newMetricValue}
/>
```

### Custom Themes
```css
/* Override in globals.css */
:root {
  --primary-color: #your-color;
  --font-family: 'Your Font', sans-serif;
}
```

### New Languages
```javascript
// Add to constants.js
export const TRANSLATIONS = {
  en: { title: 'MGNREGA Goa Dashboard' },
  hi: { title: 'मनरेगा गोवा डैशबोर्ड' }
}
```

## 🆘 Troubleshooting

### Common Issues

**Q: Page won't load**
```bash
# Check backend is running
curl http://localhost:5000/health

# Clear browser cache
Ctrl+Shift+R (hard refresh)
```

**Q: Charts not displaying**
```bash
# Verify data format
console.log('Chart data:', chartData)

# Check browser console for errors
F12 → Console tab
```

**Q: Mobile layout broken**
```bash
# Test responsive design
F12 → Toggle device toolbar
# Test on actual mobile device
```

**Q: Accessibility issues**
```bash
# Test with screen reader
# Use browser accessibility tools
# Check color contrast ratios
```

## 📞 Support

### Getting Help
- **Documentation**: Check this README
- **Issues**: Create GitHub issue
- **Support**: email@support.com
- **Community**: Join discussions

### Contributing
1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- **Government of Goa** - Data and requirements
- **data.gov.in** - Open data platform
- **React Team** - Excellent framework
- **Tailwind CSS** - Beautiful utility classes
- **Lucide Icons** - Accessible icon library

---

**🎯 Built with accessibility and user experience in mind for all literacy levels**