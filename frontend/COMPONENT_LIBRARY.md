# MGNREGA Goa Dashboard - Component Library

## 🧩 Component Library Structure

This document defines the reusable UI components for the MGNREGA Goa Dashboard, focusing on simplicity, accessibility, and low-literacy design.

## 📦 Component Categories

### 1. Layout Components
- `<Layout />` - Main page wrapper
- `<Container />` - Content container with responsive padding
- `<Header />` - Top navigation bar
- `<Footer />` - Bottom page footer
- `<Section />` - Content sections with spacing

### 2. Dashboard Components
- `<MetricCard />` - Key performance indicator cards
- `<DistrictSelector />` - District selection dropdown
- `<TrendChart />` - Line chart for monthly trends
- `<ComparisonChart />` - Bar chart for district comparison
- `<LoadingCard />` - Skeleton loading state

### 3. UI Components
- `<Button />` - Primary and secondary buttons
- `<Card />` - Base card component
- `<Select />` - Dropdown selector
- `<Badge />` - Status indicators
- `<Icon />` - SVG icon wrapper

## 🎨 Component Templates

### 1. MetricCard Component

```jsx
import React from 'react';
import { Card } from './ui/Card';
import { Icon } from './ui/Icon';

export const MetricCard = ({ 
  icon, 
  title, 
  value, 
  unit, 
  change, 
  changeType = 'positive',
  loading = false,
  onClick 
}) => {
  if (loading) {
    return <LoadingCard />;
  }

  return (
    <Card 
      className="metric-card"
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`${title}: ${value} ${unit}`}
    >
      <div className="metric-header">
        <Icon 
          name={icon} 
          size="lg"
          className="metric-icon"
          aria-hidden="true"
        />
        <h3 className="metric-title">{title}</h3>
      </div>
      
      <div className="metric-body">
        <div className="metric-value" aria-label={formatValueForScreenReader(value, unit)}>
          {formatNumber(value)}
        </div>
        <div className="metric-unit">
          {unit}
        </div>
      </div>
      
      {change && (
        <div className={`metric-change metric-change--${changeType}`}>
          <Icon 
            name={changeType === 'positive' ? 'trending-up' : 'trending-down'} 
            size="sm"
            aria-hidden="true"
          />
          <span>{change}</span>
        </div>
      )}
    </Card>
  );
};

// Helper functions
const formatNumber = (num) => {
  if (num >= 10000000) return `${(num / 10000000).toFixed(1)} Crore`;
  if (num >= 100000) return `${(num / 100000).toFixed(1)} Lakh`;
  if (num >= 1000) return num.toLocaleString('en-IN');
  return num.toString();
};

const formatValueForScreenReader = (value, unit) => {
  const formatted = formatNumber(value);
  return `${formatted} ${unit}`;
};
```

### 2. DistrictSelector Component

```jsx
import React, { useState } from 'react';
import { Select } from './ui/Select';
import { Button } from './ui/Button';
import { Icon } from './ui/Icon';

export const DistrictSelector = ({ 
  districts = [], 
  selectedDistrict, 
  onDistrictChange,
  showAutoDetect = true,
  loading = false
}) => {
  const [isDetecting, setIsDetecting] = useState(false);

  const handleAutoDetect = async () => {
    if (!navigator.geolocation) {
      alert('Location detection not supported on this device');
      return;
    }

    setIsDetecting(true);
    
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000,
          enableHighAccuracy: false
        });
      });

      // Simple logic - can be enhanced with actual geo-mapping
      const { latitude, longitude } = position.coords;
      
      // Goa coordinates: North Goa ~15.5°N, South Goa ~15.2°N
      const detectedDistrict = latitude > 15.35 ? 'North Goa' : 'South Goa';
      
      onDistrictChange(detectedDistrict);
    } catch (error) {
      console.error('Location detection failed:', error);
      alert('Could not detect your location. Please select manually.');
    } finally {
      setIsDetecting(false);
    }
  };

  return (
    <div className="district-selector">
      <label className="district-label">
        <Icon name="map-pin" size="sm" aria-hidden="true" />
        Choose Your District
      </label>
      
      <div className="selector-container">
        <Select
          value={selectedDistrict}
          onValueChange={onDistrictChange}
          disabled={loading}
          aria-label="Select district"
        >
          <Select.Trigger className="district-trigger">
            <Select.Value placeholder="Select your district..." />
          </Select.Trigger>
          
          <Select.Content>
            {districts.map(district => (
              <Select.Item key={district.code} value={district.code}>
                <Icon name="map-pin" size="xs" />
                {district.name}
              </Select.Item>
            ))}
          </Select.Content>
        </Select>

        {showAutoDetect && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleAutoDetect}
            disabled={isDetecting || loading}
            className="auto-detect-btn"
            aria-label="Automatically detect your location"
          >
            <Icon 
              name={isDetecting ? "loader" : "crosshair"} 
              size="xs" 
              className={isDetecting ? "animate-spin" : ""}
            />
            {isDetecting ? 'Detecting...' : 'Find My Area'}
          </Button>
        )}
      </div>
    </div>
  );
};
```

### 3. TrendChart Component

```jsx
import React, { useRef, useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Card } from './ui/Card';
import { Icon } from './ui/Icon';

export const TrendChart = ({ 
  data = [], 
  title, 
  height = 300,
  showInsights = true,
  loading = false 
}) => {
  const chartRef = useRef();
  const [insight, setInsight] = useState('');

  useEffect(() => {
    if (data.length > 0) {
      generateInsight(data);
    }
  }, [data]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#1f2937',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: (context) => {
            const month = context[0].label;
            return `Month: ${month}`;
          },
          label: (context) => {
            const value = formatNumber(context.parsed.y);
            return `Work Done: ${value} days`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 14
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: '#e5e7eb'
        },
        ticks: {
          font: {
            size: 14
          },
          callback: (value) => formatNumber(value)
        }
      }
    },
    elements: {
      line: {
        borderWidth: 3,
        borderColor: '#15803d',
        backgroundColor: 'rgba(21, 128, 61, 0.1)',
        fill: true,
        tension: 0.4
      },
      point: {
        radius: 6,
        hoverRadius: 8,
        backgroundColor: '#15803d',
        borderColor: '#ffffff',
        borderWidth: 2
      }
    },
    accessibility: {
      enabled: true,
      description: `Line chart showing monthly progress from ${data[0]?.month} to ${data[data.length - 1]?.month}`
    }
  };

  const chartData = {
    labels: data.map(d => d.month),
    datasets: [{
      data: data.map(d => d.person_days),
      label: 'Person Days'
    }]
  };

  const generateInsight = (chartData) => {
    if (chartData.length < 2) return;
    
    const firstValue = chartData[0].person_days;
    const lastValue = chartData[chartData.length - 1].person_days;
    const percentChange = ((lastValue - firstValue) / firstValue * 100).toFixed(0);
    
    if (percentChange > 10) {
      setInsight(`📈 Great progress! Work increased by ${percentChange}% this year.`);
    } else if (percentChange > 0) {
      setInsight(`📈 Steady improvement with ${percentChange}% growth.`);
    } else if (percentChange > -5) {
      setInsight(`📊 Stable performance with minimal changes.`);
    } else {
      setInsight(`📉 Work decreased by ${Math.abs(percentChange)}%. Needs attention.`);
    }
  };

  if (loading) {
    return <ChartSkeleton height={height} />;
  }

  return (
    <Card className="trend-chart">
      <div className="chart-header">
        <h3 className="chart-title">
          <Icon name="trending-up" size="sm" aria-hidden="true" />
          {title}
        </h3>
      </div>
      
      <div 
        className="chart-container"
        style={{ height }}
        role="img"
        aria-label={`Trend chart showing ${title}`}
        aria-describedby="chart-description"
      >
        <Line 
          ref={chartRef}
          data={chartData} 
          options={chartOptions}
        />
      </div>

      {showInsights && insight && (
        <div className="chart-footer">
          <div 
            id="chart-description" 
            className="chart-insight"
            role="status"
            aria-live="polite"
          >
            {insight}
          </div>
        </div>
      )}
    </Card>
  );
};

const ChartSkeleton = ({ height }) => (
  <Card className="chart-skeleton">
    <div className="skeleton-title" />
    <div className="skeleton-chart" style={{ height }} />
    <div className="skeleton-insight" />
  </Card>
);
```

### 4. Layout Component

```jsx
import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { Container } from './Container';
import { ErrorBoundary } from './ErrorBoundary';

export const Layout = ({ children }) => {
  return (
    <ErrorBoundary>
      <div className="app-layout">
        <Header />
        
        <main className="main-content" role="main" id="main-content">
          <Container>
            {children}
          </Container>
        </main>
        
        <Footer />
      </div>
    </ErrorBoundary>
  );
};

export const Header = () => {
  return (
    <header className="app-header" role="banner">
      <Container>
        <div className="header-content">
          <div className="header-left">
            <button 
              className="menu-button"
              aria-label="Open navigation menu"
              aria-expanded="false"
            >
              <Icon name="menu" size="md" />
            </button>
            
            <div className="logo">
              <Icon name="building-government" size="lg" />
              <div className="logo-text">
                <div className="logo-title">MGNREGA Goa</div>
                <div className="logo-subtitle">Dashboard</div>
              </div>
            </div>
          </div>
          
          <div className="header-right">
            <button 
              className="help-button"
              aria-label="Get help"
            >
              <Icon name="help-circle" size="md" />
              <span className="help-text">Help</span>
            </button>
          </div>
        </div>
      </Container>
    </header>
  );
};

export const Container = ({ children, size = 'default' }) => {
  const sizeClasses = {
    sm: 'max-w-4xl',
    default: 'max-w-6xl',
    lg: 'max-w-7xl',
    full: 'max-w-full'
  };

  return (
    <div className={`container mx-auto px-4 sm:px-6 lg:px-8 ${sizeClasses[size]}`}>
      {children}
    </div>
  );
};
```

### 5. UI Base Components

```jsx
// Card Component
export const Card = ({ 
  children, 
  className = '', 
  onClick, 
  variant = 'default',
  ...props 
}) => {
  const baseClasses = 'bg-white rounded-lg shadow-sm border border-gray-200';
  const variants = {
    default: 'p-6',
    compact: 'p-4',
    metric: 'p-6 hover:shadow-md transition-shadow cursor-pointer'
  };

  const classes = `${baseClasses} ${variants[variant]} ${className}`;

  return (
    <div 
      className={classes}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

// Button Component
export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500'
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <Icon name="loader" size="sm" className="animate-spin mr-2" />
      )}
      {children}
    </button>
  );
};

// Icon Component
export const Icon = ({ 
  name, 
  size = 'md', 
  className = '',
  ...props 
}) => {
  const sizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8'
  };

  const IconComponent = iconMap[name];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return (
    <IconComponent 
      className={`${sizes[size]} ${className}`}
      {...props}
    />
  );
};

// Icon mapping (using lucide-react icons)
const iconMap = {
  'menu': MenuIcon,
  'map-pin': MapPinIcon,
  'trending-up': TrendingUpIcon,
  'trending-down': TrendingDownIcon,
  'building-government': BuildingIcon,
  'help-circle': HelpCircleIcon,
  'loader': LoaderIcon,
  'crosshair': CrosshairIcon,
  // Add more icons as needed
};
```

## 📱 Responsive Utilities

### CSS Classes for Components

```css
/* Metric Cards */
.metric-card {
  @apply bg-white rounded-xl shadow-sm border border-gray-100 p-6;
  @apply hover:shadow-md transition-all duration-200;
  @apply cursor-pointer;
}

.metric-header {
  @apply flex items-center gap-3 mb-4;
}

.metric-icon {
  @apply text-blue-600;
}

.metric-title {
  @apply text-lg font-medium text-gray-700 leading-tight;
}

.metric-body {
  @apply mb-4;
}

.metric-value {
  @apply text-3xl font-bold text-gray-900 leading-none;
  font-family: 'Inter', monospace;
}

.metric-unit {
  @apply text-sm text-gray-600 mt-1;
}

.metric-change {
  @apply flex items-center gap-1 text-sm font-medium;
}

.metric-change--positive {
  @apply text-green-600;
}

.metric-change--negative {
  @apply text-red-600;
}

/* District Selector */
.district-selector {
  @apply space-y-3;
}

.district-label {
  @apply flex items-center gap-2 text-lg font-medium text-gray-700;
}

.selector-container {
  @apply flex gap-3;
}

.district-trigger {
  @apply flex-1 min-h-[44px] px-4 py-2 text-left;
  @apply bg-white border border-gray-300 rounded-lg;
  @apply focus:ring-2 focus:ring-blue-500 focus:border-transparent;
}

.auto-detect-btn {
  @apply min-h-[44px] px-4 py-2 whitespace-nowrap;
}

/* Charts */
.trend-chart {
  @apply p-6;
}

.chart-header {
  @apply mb-4;
}

.chart-title {
  @apply flex items-center gap-2 text-xl font-semibold text-gray-800;
}

.chart-container {
  @apply relative;
}

.chart-footer {
  @apply mt-4 pt-4 border-t border-gray-100;
}

.chart-insight {
  @apply text-sm text-gray-600 bg-gray-50 rounded-lg p-3;
}

/* Loading States */
.skeleton {
  @apply animate-pulse bg-gray-200 rounded;
}

.skeleton-title {
  @apply skeleton h-6 w-3/4 mb-4;
}

.skeleton-chart {
  @apply skeleton rounded-lg mb-4;
}

.skeleton-insight {
  @apply skeleton h-4 w-1/2;
}

/* Responsive Grid */
.metrics-grid {
  @apply grid grid-cols-1 gap-6;
  
  @screen md {
    @apply grid-cols-2;
  }
  
  @screen lg {
    @apply grid-cols-3;
  }
}

.charts-grid {
  @apply grid grid-cols-1 gap-8;
  
  @screen lg {
    @apply grid-cols-3;
  }
}

.chart-main {
  @screen lg {
    @apply col-span-2;
  }
}

.chart-secondary {
  @screen lg {
    @apply col-span-1;
  }
}

/* Focus Styles */
.focus-visible {
  @apply outline-none ring-2 ring-blue-500 ring-offset-2;
}

/* High Contrast Mode */
@media (prefers-contrast: high) {
  .metric-card {
    @apply border-2 border-gray-400;
  }
  
  .metric-value {
    @apply text-black;
  }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .metric-card {
    @apply transition-none;
  }
  
  .animate-spin {
    @apply animate-none;
  }
}
```

## 🎨 Theme Configuration

```javascript
// tailwind.config.js additions
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#ecfdf5',
          500: '#15803d',
          600: '#16a34a',
          700: '#166534',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          600: '#4b5563',
          700: '#374151',
          900: '#111827',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['Inter', 'Roboto Mono', 'monospace'],
      },
      fontSize: {
        'xs': '12px',
        'sm': '14px',
        'base': '16px',
        'lg': '18px',
        'xl': '20px',
        '2xl': '24px',
        '3xl': '32px',
      }
    }
  }
}
```

## 🧪 Usage Examples

```jsx
// Dashboard Page Implementation
const Dashboard = () => {
  const [selectedDistrict, setSelectedDistrict] = useState('north-goa');
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  return (
    <Layout>
      <div className="dashboard">
        <div className="dashboard-header">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            MGNREGA Goa Dashboard
          </h1>
          <p className="text-gray-600 mb-8">
            Track employment and development in your area
          </p>
        </div>

        <DistrictSelector
          districts={districts}
          selectedDistrict={selectedDistrict}
          onDistrictChange={setSelectedDistrict}
          loading={loading}
        />

        <div className="metrics-grid">
          <MetricCard
            icon="briefcase"
            title="Total Work Done"
            value={metrics?.personDays || 0}
            unit="days"
            change="+12% this month"
            loading={loading}
          />
          
          <MetricCard
            icon="home"
            title="Families Helped"
            value={metrics?.households || 0}
            unit="families"
            change="+8% this month"
            loading={loading}
          />
          
          <MetricCard
            icon="rupee-sign"
            title="Money Spent"
            value={metrics?.fundsSpent || 0}
            unit=""
            change="+15% this month"
            loading={loading}
          />
        </div>

        <div className="charts-grid">
          <div className="chart-main">
            <TrendChart
              data={trendData}
              title="Monthly Progress"
              loading={loading}
            />
          </div>
          
          <div className="chart-secondary">
            <ComparisonChart
              data={comparisonData}
              title="District Comparison"
              loading={loading}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};
```

This component library provides a solid foundation for building the MGNREGA Goa Dashboard with consistent, accessible, and user-friendly components.