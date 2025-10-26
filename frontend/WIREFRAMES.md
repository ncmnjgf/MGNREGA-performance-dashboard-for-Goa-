# MGNREGA Goa Dashboard - UI Wireframes & Component Specs

## 🎨 Visual Wireframes

### 1. Mobile Landing Page (320px-768px)

```
┌─────────────────────┐
│ ☰ MGNREGA Goa   🌐 │ ← Header (56px height)
├─────────────────────┤
│                     │
│  🏛️ MGNREGA Goa     │ ← Hero Section
│    Dashboard        │   (120px height)
│                     │
│  Track jobs & funds │
│  in your area       │
├─────────────────────┤
│                     │
│ 📍 Choose District  │ ← District Selector
│ ┌─────────────────┐ │   (80px height)
│ │ North Goa     ▼ │ │
│ └─────────────────┘ │
│ [📍 Find My Area]   │
├─────────────────────┤
│                     │
│ ┌─────────────────┐ │ ← Metric Cards
│ │     💼          │ │   (Each 120px height)
│ │ Total Work Done │ │   (16px gap between)
│ │                 │ │
│ │   1,25,500      │ │
│ │     days        │ │
│ │                 │ │
│ │  📈 +12% ↑      │ │
│ └─────────────────┘ │
│                     │
│ ┌─────────────────┐ │
│ │     🏠          │ │
│ │ Families Helped │ │
│ │                 │ │
│ │     8,450       │ │
│ │    families     │ │
│ │                 │ │
│ │  📈 +8% ↑       │ │
│ └─────────────────┘ │
│                     │
│ ┌─────────────────┐ │
│ │     💰          │ │
│ │  Money Spent    │ │
│ │                 │ │
│ │   ₹2.5 Crores   │ │
│ │                 │ │
│ │                 │ │
│ │  📈 +15% ↑      │ │
│ └─────────────────┘ │
├─────────────────────┤
│                     │
│ 📈 Monthly Progress │ ← Chart Section
│ ┌─────────────────┐ │   (300px height)
│ │       ••••      │ │
│ │      /    ••    │ │
│ │     /       •   │ │
│ │    /            │ │
│ │   /             │ │
│ │  ●              │ │
│ │ Jan Feb ... Dec │ │
│ └─────────────────┘ │
│                     │
│ [View Comparison]   │ ← Action Button
├─────────────────────┤
│ ℹ️ About | 🆘 Help   │ ← Footer
└─────────────────────┘
```

### 2. Desktop Dashboard (1024px+)

```
┌───────────────────────────────────────────────────────────────────────┐
│ ☰ MGNREGA Goa Dashboard           🌐 English ▼  ❓Help  👤Profile    │ ← Header (64px)
├───────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  🏛️ MGNREGA Employment Dashboard - Goa State                          │ ← Hero (100px)
│     Real-time data on rural employment and development               │
│                                                                       │
├───────────────────────────────────────────────────────────────────────┤
│                                                                       │
│ 📍 Select District: [ North Goa ▼ ]    📊 Data as of: Dec 2024      │ ← Controls (60px)
│                                                                       │
├───────────────────────────────────────────────────────────────────────┤
│                                                                       │
│ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐           │ ← Metrics Row
│ │      💼         │ │       🏠        │ │       💰        │           │   (180px height)
│ │                 │ │                 │ │                 │           │
│ │ Total Work Done │ │ Families Helped │ │  Money Spent    │           │
│ │                 │ │                 │ │                 │           │
│ │   1,25,500      │ │     8,450       │ │  ₹2.5 Crores    │           │
│ │     days        │ │    families     │ │                 │           │
│ │                 │ │                 │ │                 │           │
│ │ 📈 +12% this mo │ │ 📈 +8% this mo  │ │ 📈 +15% this mo │           │
│ │                 │ │                 │ │                 │           │
│ │ [View Details]  │ │ [View Details]  │ │ [View Details]  │           │
│ └─────────────────┘ └─────────────────┘ └─────────────────┘           │
│                                                                       │
├───────────────────────────────────────────────────────────────────────┤
│                                                                       │
│ ┌─────────────────────────────────────┐ ┌───────────────────────────┐ │ ← Charts Row
│ │                                     │ │                           │ │   (400px height)
│ │ 📈 Monthly Progress (2024)          │ │ 🏆 District Comparison    │ │
│ │ ┌─────────────────────────────────┐ │ │                           │ │
│ │ │ 150│                        ••• │ │ │ North Goa                 │ │
│ │ │    │                   ••••     │ │ │ ████████████░░░░  75%     │ │
│ │ │ 120│              ••••          │ │ │                           │ │
│ │ │    │         ••••               │ │ │ South Goa                 │ │
│ │ │  90│    ••••                    │ │ │ ███████████████░  85%     │ │
│ │ │    │••••                        │ │ │                           │ │
│ │ │  60└──┬──┬──┬──┬──┬──┬──┬──┬── │ │ │ [View Full Report]        │ │
│ │ │     Jan Feb Mar Apr May Jun Jul │ │ │                           │ │
│ │ └─────────────────────────────────┘ │ └───────────────────────────┘ │
│ │                                     │                               │
│ │ Shows steady improvement 📈         │                               │
│ └─────────────────────────────────────┘                               │
│                                                                       │
├───────────────────────────────────────────────────────────────────────┤
│                                                                       │
│ 📊 Quick Facts                                                        │ ← Info Section
│ • Work guaranteed for 100 days per family                            │   (120px height)
│ • Average wage: ₹200 per day                                         │
│ • Focus on water, roads, and agriculture                             │
│                                                                       │
├───────────────────────────────────────────────────────────────────────┤
│ 📞 Contact | 📋 About MGNREGA | 🔒 Privacy | 🏛️ Government of Goa     │ ← Footer (40px)
└───────────────────────────────────────────────────────────────────────┘
```

### 3. Tablet Layout (768px-1024px)

```
┌─────────────────────────────────────────────────────┐
│ ☰ MGNREGA Goa Dashboard              🌐 EN  ❓Help │ ← Header
├─────────────────────────────────────────────────────┤
│                                                     │
│  🏛️ MGNREGA Goa Dashboard                           │ ← Hero
│     Employment & Development Tracker               │
│                                                     │
│ 📍 District: [ North Goa ▼ ]    📊 Dec 2024       │ ← Controls
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│ ┌─────────────────┐   ┌─────────────────┐           │ ← Metrics
│ │     💼          │   │      🏠         │           │   (2x2 Grid)
│ │Total Work Done  │   │Families Helped  │           │
│ │                 │   │                 │           │
│ │   1,25,500      │   │     8,450       │           │
│ │    days         │   │   families      │           │
│ │                 │   │                 │           │
│ │ 📈 +12% ↑       │   │ 📈 +8% ↑        │           │
│ └─────────────────┘   └─────────────────┘           │
│                                                     │
│ ┌─────────────────┐   ┌─────────────────┐           │
│ │     💰          │   │      📊         │           │
│ │  Money Spent    │   │  Work Progress  │           │
│ │                 │   │                 │           │
│ │  ₹2.5 Crores    │   │      85%        │           │
│ │                 │   │   completed     │           │
│ │                 │   │                 │           │
│ │ 📈 +15% ↑       │   │ 📈 On Track     │           │
│ └─────────────────┘   └─────────────────┘           │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│ 📈 Monthly Trends                                   │ ← Chart
│ ┌─────────────────────────────────────────────────┐ │
│ │                                            •••• │ │
│ │                                      ••••       │ │
│ │                                 ••••             │ │
│ │                            ••••                  │ │
│ │                      ••••                       │ │
│ │                 ••••                            │ │
│ │            ••••                                 │ │
│ │       ••••                                      │ │
│ │  ••••                                           │ │
│ │ Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec │ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
│ [Compare Districts] [Export Data] [More Details]   │ ← Actions
│                                                     │
└─────────────────────────────────────────────────────┘
```

## 🎨 Component Specifications

### 1. MetricCard Component

```jsx
<MetricCard>
  <CardHeader>
    <Icon size="32px" color="primary" />
    <Title fontSize="18px" fontWeight="semibold" />
  </CardHeader>
  
  <CardBody>
    <Value fontSize="32px" fontWeight="bold" color="gray-900" />
    <Unit fontSize="16px" color="gray-600" />
    
    <Change>
      <Icon name="trend-up" />
      <Text>+12% this month</Text>
    </Change>
  </CardBody>
  
  <CardFooter>
    <Button variant="ghost" size="sm">View Details</Button>
  </CardFooter>
</MetricCard>
```

**Dimensions:**
- Mobile: 100% width × 120px height
- Desktop: 300px width × 180px height
- Padding: 20px all sides
- Border radius: 12px
- Shadow: soft drop shadow

**States:**
- Default: White background, subtle border
- Hover: Slight shadow increase
- Loading: Skeleton animation
- Error: Light red background with error message

### 2. DistrictSelector Component

```jsx
<DistrictSelector>
  <Label>📍 Select Your District</Label>
  
  <SelectTrigger>
    <SelectValue placeholder="Choose district..." />
    <ChevronDown />
  </SelectTrigger>
  
  <SelectContent>
    <SelectItem value="north-goa">
      <MapPin />
      North Goa
    </SelectItem>
    <SelectItem value="south-goa">
      <MapPin />
      South Goa
    </SelectItem>
  </SelectContent>
  
  <AutoDetectButton>
    <LocationIcon />
    Auto-detect my area
  </AutoDetectButton>
</DistrictSelector>
```

**Dimensions:**
- Mobile: 100% width × 60px height
- Desktop: 300px width × 60px height
- Touch target: 44px minimum
- Border radius: 8px

### 3. TrendChart Component

```jsx
<TrendChart>
  <ChartHeader>
    <Title>📈 Monthly Progress</Title>
    <Subtitle>Work done over time</Subtitle>
  </ChartHeader>
  
  <ChartContainer>
    <LineChart
      data={monthlyData}
      xAxis="month"
      yAxis="person_days"
      smooth={true}
      strokeWidth={3}
      color="primary"
    />
  </ChartContainer>
  
  <ChartFooter>
    <Legend />
    <Insight>Shows steady improvement! 📈</Insight>
  </ChartFooter>
</TrendChart>
```

**Features:**
- Responsive design
- Touch-friendly data points
- Simple tooltips
- Clear axis labels
- Accessibility support

### 4. Header Component

```jsx
<Header>
  <Container>
    <LeftSection>
      <MenuButton />
      <Logo>
        <GovIcon />
        MGNREGA Goa
      </Logo>
    </LeftSection>
    
    <RightSection>
      <LanguageSelector />
      <HelpButton />
      <ProfileMenu />
    </RightSection>
  </Container>
</Header>
```

**Dimensions:**
- Mobile: 100% width × 56px height
- Desktop: 100% width × 64px height
- Sticky positioning on scroll

## 📱 Responsive Breakpoints

### Mobile First Design

```css
/* Mobile (320px - 767px) */
.container {
  padding: 16px;
  grid-template-columns: 1fr;
  gap: 16px;
}

.metric-card {
  width: 100%;
  height: 120px;
  margin-bottom: 16px;
}

.chart-container {
  height: 250px;
  margin: 20px 0;
}

/* Tablet (768px - 1023px) */
@media (min-width: 768px) {
  .container {
    padding: 24px;
    max-width: 768px;
    margin: 0 auto;
  }
  
  .metrics-grid {
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
  
  .chart-container {
    height: 300px;
  }
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  .container {
    max-width: 1200px;
    padding: 32px;
  }
  
  .metrics-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }
  
  .chart-section {
    grid-template-columns: 2fr 1fr;
    gap: 32px;
  }
  
  .chart-container {
    height: 400px;
  }
}

/* Large Desktop (1440px+) */
@media (min-width: 1440px) {
  .container {
    max-width: 1400px;
  }
}
```

## 🎨 Color Usage Guide

### Metric Cards
```css
.work-metric {
  --primary-color: #15803d; /* Green for work */
  --accent-color: #dcfce7;
}

.family-metric {
  --primary-color: #1e40af; /* Blue for families */
  --accent-color: #dbeafe;
}

.money-metric {
  --primary-color: #ea580c; /* Orange for money */
  --accent-color: #fed7aa;
}

.progress-metric {
  --primary-color: #7c3aed; /* Purple for progress */
  --accent-color: #e9d5ff;
}
```

### Chart Colors
```css
.trend-line {
  stroke: #15803d;
  stroke-width: 3px;
  fill: none;
}

.comparison-bars {
  --north-goa: #1e40af;
  --south-goa: #ea580c;
}

.success-indicator { color: #16a34a; }
.warning-indicator { color: #ca8a04; }
.error-indicator { color: #dc2626; }
```

## 🔤 Typography Scale

### Heading Scale
```css
.hero-title {
  font-size: 32px;
  font-weight: 700;
  line-height: 1.2;
  color: #111827;
}

.section-title {
  font-size: 24px;
  font-weight: 600;
  line-height: 1.3;
  color: #374151;
}

.card-title {
  font-size: 18px;
  font-weight: 500;
  line-height: 1.4;
  color: #4b5563;
}
```

### Body Text Scale
```css
.large-number {
  font-size: 32px;
  font-weight: 700;
  font-family: 'Inter', monospace;
  color: #111827;
}

.body-text {
  font-size: 16px;
  font-weight: 400;
  line-height: 1.6;
  color: #374151;
}

.small-text {
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
  color: #6b7280;
}

.caption {
  font-size: 12px;
  font-weight: 400;
  line-height: 1.4;
  color: #9ca3af;
}
```

## 🖱️ Interactive States

### Button States
```css
.button {
  /* Default */
  background: #1e40af;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.button:hover {
  background: #1d4ed8;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(30, 64, 175, 0.3);
}

.button:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(30, 64, 175, 0.3);
}

.button:disabled {
  background: #d1d5db;
  color: #9ca3af;
  cursor: not-allowed;
  transform: none;
}
```

### Card Hover States
```css
.metric-card {
  transition: all 0.3s ease;
}

.metric-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.metric-card:hover .card-icon {
  transform: scale(1.1);
}
```

## 📊 Loading States

### Skeleton Components
```jsx
// Card Skeleton
<SkeletonCard>
  <SkeletonIcon />
  <SkeletonText lines={1} width="60%" />
  <SkeletonNumber />
  <SkeletonText lines={1} width="40%" />
</SkeletonCard>

// Chart Skeleton
<SkeletonChart>
  <SkeletonTitle />
  <SkeletonAxis />
  <SkeletonLine />
</SkeletonChart>
```

### Loading Animations
```css
@keyframes skeleton-loading {
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
}

.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, transparent 37%, #f0f0f0 63%);
  background-size: 400px 100%;
  animation: skeleton-loading 1.4s ease-in-out infinite;
}
```

## 🎯 Accessibility Features

### Semantic HTML Structure
```html
<main role="main">
  <section aria-labelledby="metrics-title">
    <h2 id="metrics-title">Key Performance Metrics</h2>
    
    <div class="metrics-grid" role="group" aria-label="MGNREGA metrics">
      <article class="metric-card" aria-labelledby="work-title">
        <h3 id="work-title">Total Work Done</h3>
        <div class="metric-value" aria-label="1 lakh 25 thousand 5 hundred days">
          1,25,500 days
        </div>
        <div class="metric-change" aria-label="Increased by 12 percent this month">
          +12% this month
        </div>
      </article>
    </div>
  </section>
</main>
```

### ARIA Labels
```jsx
<TrendChart 
  role="img"
  aria-label="Line chart showing monthly work progress from January to December"
  aria-describedby="chart-description"
>
  <div id="chart-description" className="sr-only">
    The chart shows steady growth from 60,000 person-days in January 
    to 125,000 person-days in December, indicating consistent program improvement.
  </div>
</TrendChart>
```

### Keyboard Navigation
```css
/* Focus indicators */
.focusable:focus {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
  border-radius: 4px;
}

/* Skip to content link */
.skip-to-content {
  position: absolute;
  top: -40px;
  left: 6px;
  background: #000;
  color: white;
  padding: 8px;
  text-decoration: none;
  z-index: 100;
}

.skip-to-content:focus {
  top: 6px;
}
```

## 📱 Touch Optimization

### Touch Targets
```css
/* Minimum 44px touch targets */
.touch-target {
  min-height: 44px;
  min-width: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Comfortable spacing between touch elements */
.touch-list > * + * {
  margin-top: 8px;
}

/* Larger tap areas for important actions */
.primary-action {
  padding: 16px 24px;
  min-height: 56px;
}
```

### Mobile Gestures
```javascript
// Swipe gestures for chart navigation
const chartContainer = useRef();

useEffect(() => {
  const hammer = new Hammer(chartContainer.current);
  
  hammer.on('swipeleft', () => {
    // Next time period
    setTimePeriod(period => period + 1);
  });
  
  hammer.on('swiperight', () => {
    // Previous time period
    setTimePeriod(period => period - 1);
  });
}, []);
```

This comprehensive wireframe guide provides detailed specifications for building a user-friendly, accessible, and responsive MGNREGA Goa Dashboard that prioritizes clarity and ease of use for all literacy levels.