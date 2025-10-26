# MGNREGA Goa Dashboard - Frontend Plan

## 🎯 Project Overview

A user-friendly, low-literacy dashboard for displaying MGNREGA data in Goa. Focus on simplicity, clear visuals, and accessibility.

## 👥 Target Audience

- **Primary**: Rural citizens, local officials, field workers
- **Secondary**: Government administrators, researchers
- **Literacy Level**: Low to moderate (5th-8th grade reading level)
- **Tech Experience**: Basic smartphone/computer usage

## 🎨 Design Philosophy

### Core Principles
- **Simplicity First**: Minimal cognitive load
- **Visual Communication**: Icons > Text where possible  
- **Progressive Disclosure**: Show essential info first
- **Mobile-First**: Optimized for smartphones
- **Accessibility**: WCAG 2.1 AA compliance

### Visual Language
- **Large Fonts**: 18px+ for body text, 24px+ for headings
- **High Contrast**: Dark text on light backgrounds
- **Clear Icons**: Universally recognizable symbols
- **Generous Spacing**: Avoid crowded layouts
- **Simple Language**: 5th grade reading level

## 🏗️ Architecture

### Technology Stack
```
Frontend Framework: React 18 + Vite
UI Library: Tailwind CSS + Headless UI
Charts: Chart.js / Recharts
Icons: Lucide React / Heroicons
Maps: Leaflet (optional location feature)
State Management: React Context / Zustand
HTTP Client: Axios
Build Tool: Vite
Deployment: Vercel / Netlify
```

### Component Structure
```
src/
├── components/
│   ├── common/
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── LoadingSpinner.jsx
│   │   └── ErrorBoundary.jsx
│   ├── dashboard/
│   │   ├── MetricsCards.jsx
│   │   ├── TrendChart.jsx
│   │   ├── ComparisonChart.jsx
│   │   └── DistrictSelector.jsx
│   ├── ui/
│   │   ├── Card.jsx
│   │   ├── Button.jsx
│   │   ├── Select.jsx
│   │   └── Modal.jsx
│   └── layout/
│       ├── Layout.jsx
│       └── Container.jsx
├── pages/
│   ├── Dashboard.jsx
│   ├── About.jsx
│   └── Help.jsx
├── hooks/
│   ├── useApi.js
│   ├── useLocation.js
│   └── useCharts.js
├── utils/
│   ├── api.js
│   ├── formatters.js
│   └── constants.js
└── styles/
    ├── globals.css
    └── components.css
```

## 🎨 User Interface Design

### Page Layout (Desktop)

```
┌─────────────────────────────────────────────────────┐
│                   HEADER                            │
│  🏛️ MGNREGA Goa Dashboard    🌐 English ▼  ℹ️ Help   │
├─────────────────────────────────────────────────────┤
│                                                     │
│  📍 Select Your District: [ North Goa ▼ ]  📍 Auto │
│                                                     │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐     │
│  │    💼       │ │    🏠       │ │    💰       │     │
│  │Total Work   │ │Families     │ │Money Spent  │     │
│  │Done         │ │Helped       │ │             │     │
│  │  125,500    │ │   8,450     │ │₹2.5 Crores  │     │
│  │  days       │ │ families    │ │             │     │
│  └─────────────┘ └─────────────┘ └─────────────┘     │
│                                                     │
│  📈 Work Progress Over Time                         │
│  ┌─────────────────────────────────────────────────┐ │
│  │                                                 │ │
│  │    ••••••••••••••••••••••••••••••••••••••      │ │
│  │   /                                             │ │
│  │  /                                              │ │
│  │ /                                               │ │
│  │Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec  │ │
│  └─────────────────────────────────────────────────┘ │
│                                                     │
│  🏆 Compare Districts                               │
│  ┌─────────────────────────────────────────────────┐ │
│  │ North Goa ████████████████░░░░  75%             │ │
│  │ South Goa ███████████████████░░  85%             │ │
│  └─────────────────────────────────────────────────┘ │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Mobile Layout (Responsive)

```
┌─────────────────────┐
│  🏛️ MGNREGA Goa      │
│     Dashboard      │
│                    │
│ 📍 Select District │
│ [ North Goa ▼ ]   │
│                    │
│ ┌─────────────────┐ │
│ │     💼          │ │
│ │ Total Work Done │ │
│ │   125,500 days  │ │
│ └─────────────────┘ │
│                    │
│ ┌─────────────────┐ │
│ │     🏠          │ │
│ │ Families Helped │ │
│ │   8,450 families│ │
│ └─────────────────┘ │
│                    │
│ ┌─────────────────┐ │
│ │     💰          │ │
│ │  Money Spent    │ │
│ │  ₹2.5 Crores    │ │
│ └─────────────────┘ │
│                    │
│ 📈 Monthly Progress │
│ ┌─────────────────┐ │
│ │       ••••      │ │
│ │      /    \     │ │
│ │     /      •    │ │
│ │    /            │ │
│ │   /             │ │
│ └─────────────────┘ │
└─────────────────────┘
```

## 🎨 Visual Design System

### Color Palette
```css
/* Primary Colors */
--primary-green: #15803d     /* Government green */
--primary-blue: #1e40af      /* Trust blue */
--primary-orange: #ea580c    /* Alert orange */

/* Semantic Colors */
--success: #16a34a           /* Success green */
--warning: #ca8a04           /* Warning yellow */
--error: #dc2626             /* Error red */
--info: #2563eb              /* Info blue */

/* Neutrals */
--white: #ffffff
--gray-50: #f9fafb
--gray-100: #f3f4f6
--gray-200: #e5e7eb
--gray-500: #6b7280
--gray-900: #111827

/* Backgrounds */
--bg-primary: #f9fafb        /* Light gray */
--bg-card: #ffffff           /* Pure white */
--bg-accent: #ecfdf5         /* Light green */
```

### Typography Scale
```css
/* Font Sizes (Mobile First) */
--text-xs: 12px      /* Small labels */
--text-sm: 14px      /* Secondary text */
--text-base: 18px    /* Body text */
--text-lg: 20px      /* Large text */
--text-xl: 24px      /* Card numbers */
--text-2xl: 32px     /* Page headings */
--text-3xl: 40px     /* Hero numbers */

/* Font Weights */
--font-normal: 400
--font-medium: 500
--font-semibold: 600
--font-bold: 700

/* Font Family */
--font-primary: 'Inter', 'Noto Sans', system-ui, sans-serif
--font-numbers: 'Inter', 'Roboto Mono', monospace
```

### Component Tokens
```css
/* Spacing */
--space-1: 4px
--space-2: 8px
--space-3: 12px
--space-4: 16px
--space-6: 24px
--space-8: 32px
--space-12: 48px

/* Border Radius */
--radius-sm: 4px
--radius-md: 8px
--radius-lg: 12px
--radius-xl: 16px

/* Shadows */
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05)
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07)
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1)
```

## 📱 Component Specifications

### 1. Metrics Cards
```jsx
// Simple, large, clear metrics
<MetricCard 
  icon="💼" 
  label="Total Work Done"
  value="125,500"
  unit="days"
  change="+12% this month"
  color="green"
/>
```

**Design Requirements:**
- Large, bold numbers (32px+)
- Clear, simple labels
- Meaningful icons
- Optional change indicator
- High contrast colors
- Touch-friendly (44px+ touch targets)

### 2. District Selector
```jsx
// Location-aware dropdown
<DistrictSelector 
  districts={['North Goa', 'South Goa']}
  selected="North Goa"
  showAutoDetect={true}
  onChange={handleDistrictChange}
/>
```

**Features:**
- Large, easy-to-tap dropdown
- Auto-detection option
- Clear district names (no codes)
- Optional map integration

### 3. Trend Chart
```jsx
// Simple line chart showing monthly progress
<TrendChart 
  data={monthlyData}
  metric="person_days"
  title="Work Progress Over Time"
  simple={true}
/>
```

**Design Requirements:**
- Clean, uncluttered design
- Large touch points on mobile
- Simple axis labels
- Tooltips with clear information
- Responsive design

### 4. Comparison Chart
```jsx
// Bar chart comparing districts
<ComparisonChart 
  data={districtComparison}
  title="District Performance"
  showPercentages={true}
/>
```

## 🌐 User Experience Flow

### Primary User Journey
```
Landing Page
    ↓
Select District (Auto-detect or Manual)
    ↓
View Dashboard
    ↓
Explore Metrics (Cards)
    ↓
Check Trends (Charts)
    ↓
Compare Districts (Optional)
    ↓
Share/Export (Future)
```

### Interaction Patterns
1. **Progressive Enhancement**: Start with basic functionality
2. **Graceful Degradation**: Work without JavaScript
3. **Offline Support**: Cache key data locally
4. **Fast Loading**: < 3 seconds initial load

## 📊 Data Presentation

### Simplified Terminology
```
Technical Term → User-Friendly Term
────────────────────────────────
Person-Days → Total Work Done
Households → Families Helped  
Funds Spent → Money Spent
Employment Generated → Jobs Created
Work Completion Rate → Work Finished
Financial Progress → Money Used
Active Job Cards → Active Workers
```

### Number Formatting
```javascript
// Large numbers made readable
125500 → "1.25 Lakh" or "125,500"
2500000 → "₹25 Lakh" or "₹2.5 Crores"
75.5% → "76%" (rounded for simplicity)
```

### Visual Indicators
```
✅ Good Performance (Green)
⚠️ Needs Attention (Yellow)  
❌ Poor Performance (Red)
📈 Improving (Green arrow)
📉 Declining (Red arrow)
📊 Stable (Blue indicator)
```

## 🔍 Accessibility Features

### WCAG 2.1 AA Compliance
- **Color Contrast**: 4.5:1 minimum ratio
- **Font Size**: 18px minimum for body text
- **Touch Targets**: 44px minimum size
- **Alt Text**: All images and icons
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: Semantic HTML and ARIA labels

### Language Support
- **Primary**: English
- **Secondary**: Hindi (optional)
- **Local**: Konkani (future consideration)

### Low Vision Support
- **High Contrast Mode**: Alternative color scheme
- **Large Text Mode**: 1.5x font scaling
- **Simple Mode**: Reduced visual complexity

## 🚀 Performance Requirements

### Loading Targets
- **First Contentful Paint**: < 1.5 seconds
- **Largest Contentful Paint**: < 2.5 seconds
- **First Input Delay**: < 100ms
- **Cumulative Layout Shift**: < 0.1

### Optimization Strategies
- **Code Splitting**: Route-based chunks
- **Image Optimization**: WebP format, lazy loading
- **Caching**: Service worker for offline support
- **Bundle Size**: < 200KB initial bundle

## 📱 Responsive Breakpoints

```css
/* Mobile First Approach */
.container {
  /* Mobile: 320px+ */
  padding: 16px;
  
  /* Tablet: 768px+ */
  @media (min-width: 768px) {
    padding: 24px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }
  
  /* Desktop: 1024px+ */
  @media (min-width: 1024px) {
    max-width: 1200px;
    margin: 0 auto;
    grid-template-columns: 1fr 1fr 1fr;
  }
}
```

## 🧪 Testing Strategy

### User Testing
- **Field Testing**: Test with actual MGNREGA workers
- **Usability Testing**: Task-based scenarios
- **Accessibility Testing**: Screen reader compatibility
- **Performance Testing**: Slow network conditions

### Key Metrics
- **Task Completion Rate**: >90%
- **Time to Information**: <30 seconds
- **Error Rate**: <5%
- **User Satisfaction**: >4/5 rating

## 🚀 Implementation Phases

### Phase 1: MVP (2 weeks)
- [ ] Basic dashboard layout
- [ ] District selector
- [ ] Three main metric cards
- [ ] Simple trend chart
- [ ] Mobile responsive design
- [ ] API integration

### Phase 2: Enhancement (1 week)
- [ ] Comparison chart
- [ ] Auto-detect location
- [ ] Loading states
- [ ] Error handling
- [ ] Performance optimization

### Phase 3: Polish (1 week)
- [ ] Accessibility improvements
- [ ] Advanced charts
- [ ] Offline support
- [ ] User testing feedback
- [ ] Documentation

## 📋 Success Criteria

### Technical
- ✅ Loads in <3 seconds on 3G
- ✅ Works on IE11+ and all modern browsers
- ✅ 90+ Lighthouse score
- ✅ WCAG 2.1 AA compliant
- ✅ Mobile-first responsive

### User Experience
- ✅ 5th grade reading level
- ✅ Clear visual hierarchy
- ✅ Intuitive navigation
- ✅ Meaningful error messages
- ✅ Fast perceived performance

### Business
- ✅ Increases data transparency
- ✅ Reduces information requests to officials
- ✅ Improves citizen engagement
- ✅ Supports government accountability

## 🎨 Visual Mockups

### Landing Page Hero Section
```
┌─────────────────────────────────────────────────────┐
│                                                     │
│               🏛️ MGNREGA Goa                        │
│           Work and Prosperity Dashboard             │
│                                                     │
│     Track employment and development in your area   │
│                                                     │
│        📍 Select Your District                      │
│     ┌─────────────────────────────────┐             │
│     │  North Goa                    ▼ │             │
│     └─────────────────────────────────┘             │
│                                                     │
│              [📍 Auto-Detect My Area]                │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Metrics Section
```
┌─────────────────────────────────────────────────────┐
│                 📊 Key Numbers                      │
│                                                     │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐     │
│ │    💼       │ │    🏠       │ │    💰       │     │
│ │             │ │             │ │             │     │
│ │Total Work   │ │Families     │ │Money Spent  │     │
│ │Done         │ │Helped       │ │             │     │
│ │             │ │             │ │             │     │
│ │  1.25 Lakh  │ │   8,450     │ │₹2.5 Crores  │     │
│ │    days     │ │  families   │ │             │     │
│ │             │ │             │ │             │     │
│ │📈 +12%      │ │📈 +8%       │ │📈 +15%      │     │
│ │this month   │ │this month   │ │this month   │     │
│ └─────────────┘ └─────────────┘ └─────────────┘     │
└─────────────────────────────────────────────────────┘
```

### Chart Section
```
┌─────────────────────────────────────────────────────┐
│              📈 Monthly Progress                    │
│                                                     │
│ Work Done (in thousands)                            │
│ 150├─────────────────────────────────────────────── │
│    │                                           ••   │
│ 120├───────────────────────────────────────••───── │
│    │                                 ••             │
│  90├─────────────────────────••••───────────────── │
│    │                   ••                          │
│  60├───────────••••───────────────────────────── │
│    │     ••                                        │
│  30├••───────────────────────────────────────── │
│    │                                               │
│   0└──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬─────────── │
│      Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec│
│                                                     │
│              Shows steady improvement! 📈           │
└─────────────────────────────────────────────────────┘
```

## 🎯 Next Steps

1. **Review & Approve**: Stakeholder review of this plan
2. **Setup Project**: Initialize React + Vite project
3. **Create Components**: Build UI components library
4. **Implement Dashboard**: Core dashboard functionality
5. **Test & Iterate**: User testing and improvements
6. **Deploy**: Production deployment and monitoring

---

**🎨 This plan prioritizes user needs over technical complexity. Simple, clear, and helpful for all users.**