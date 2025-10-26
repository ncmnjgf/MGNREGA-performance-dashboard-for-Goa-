// Application Constants and Configuration

// Application Metadata
export const APP_CONFIG = {
  name: 'MGNREGA Goa Dashboard',
  version: '1.0.0',
  description: 'User-friendly dashboard for MGNREGA data in Goa state',
  author: 'MGNREGA Goa Team',
  supportEmail: 'support@mgnrega-goa.gov.in',
};

// API Configuration
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  timeout: 10000,
  retryAttempts: 3,
  retryDelay: 1000,
  endpoints: {
    health: '/health',
    allData: '/api',
    districts: '/api/districts',
    districtData: '/api/data',
  },
};

// Districts Configuration
export const DISTRICTS = {
  NORTH_GOA: {
    code: 'north-goa',
    name: 'North Goa',
    displayName: 'North Goa',
    coordinates: {
      latitude: 15.55,
      longitude: 73.83,
    },
    blocks: ['Pernem', 'Bardez', 'Bicholim', 'Sattari', 'Tiswadi'],
  },
  SOUTH_GOA: {
    code: 'south-goa',
    name: 'South Goa',
    displayName: 'South Goa',
    coordinates: {
      latitude: 15.25,
      longitude: 74.00,
    },
    blocks: ['Salcete', 'Mormugao', 'Quepem', 'Canacona', 'Sanguem', 'Dharbandora'],
  },
};

// UI Configuration
export const UI_CONFIG = {
  // Animation Durations (in milliseconds)
  animations: {
    fast: 150,
    normal: 300,
    slow: 500,
    chart: 800,
  },

  // Breakpoints (matching Tailwind CSS)
  breakpoints: {
    xs: 475,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
  },

  // Chart Configuration
  charts: {
    colors: {
      primary: '#15803d',
      secondary: '#1e40af',
      accent: '#ea580c',
      success: '#16a34a',
      warning: '#ca8a04',
      error: '#dc2626',
      info: '#2563eb',
    },
    height: {
      mobile: 250,
      tablet: 300,
      desktop: 400,
    },
    gridLines: '#e5e7eb',
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: {
      xs: 10,
      sm: 12,
      base: 14,
      lg: 16,
    },
  },

  // Loading States
  loading: {
    skeleton: {
      baseColor: '#f3f4f6',
      highlightColor: '#e5e7eb',
      animationDuration: 1400,
    },
    spinner: {
      size: {
        sm: 16,
        md: 24,
        lg: 32,
      },
    },
  },

  // Touch Targets
  touch: {
    minSize: 44, // Minimum touch target size in pixels
    spacing: 8,  // Minimum spacing between touch targets
  },
};

// Data Configuration
export const DATA_CONFIG = {
  // Refresh Intervals (in milliseconds)
  refreshIntervals: {
    health: 30000,      // 30 seconds
    metrics: 300000,    // 5 minutes
    charts: 600000,     // 10 minutes
  },

  // Cache Configuration
  cache: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    maxEntries: 100,
  },

  // Pagination
  pagination: {
    defaultLimit: 50,
    maxLimit: 1000,
  },

  // Number Formatting
  formatting: {
    currency: 'INR',
    locale: 'en-IN',
    precision: {
      currency: 0,
      percentage: 0,
      decimal: 1,
    },
  },
};

// MGNREGA Specific Constants
export const MGNREGA_CONFIG = {
  // Program Details
  program: {
    fullName: 'Mahatma Gandhi National Rural Employment Guarantee Act',
    shortName: 'MGNREGA',
    startYear: 2006,
    guaranteedDays: 100,
    minimumWage: 200, // Rs per day (approximate)
  },

  // Work Categories
  workCategories: [
    'Water Conservation',
    'Drought Proofing',
    'Micro Irrigation',
    'Rural Connectivity',
    'Land Development',
    'Traditional Water Bodies',
  ],

  // Performance Thresholds
  performance: {
    excellent: 90,
    good: 75,
    average: 60,
    poor: 45,
  },

  // Status Types
  status: {
    COMPLETED: 'completed',
    ONGOING: 'ongoing',
    PENDING: 'pending',
    CANCELLED: 'cancelled',
  },
};

// Metric Definitions
export const METRICS = {
  PERSON_DAYS: {
    key: 'person_days',
    title: 'Total Work Done',
    shortTitle: 'Work Done',
    unit: 'days',
    icon: '💼',
    description: 'Total person-days of employment generated',
    color: 'primary',
    format: 'number',
  },
  HOUSEHOLDS: {
    key: 'households',
    title: 'Families Helped',
    shortTitle: 'Families',
    unit: 'families',
    icon: '🏠',
    description: 'Number of households provided employment',
    color: 'secondary',
    format: 'number',
  },
  FUNDS_SPENT: {
    key: 'funds_spent',
    title: 'Money Spent',
    shortTitle: 'Funds',
    unit: '',
    icon: '💰',
    description: 'Total expenditure on MGNREGA works',
    color: 'accent',
    format: 'currency',
  },
  COMPLETION_RATE: {
    key: 'completion_rate',
    title: 'Work Finished',
    shortTitle: 'Completion',
    unit: '%',
    icon: '✅',
    description: 'Percentage of works completed',
    color: 'success',
    format: 'percentage',
  },
};

// Chart Types
export const CHART_TYPES = {
  LINE: 'line',
  BAR: 'bar',
  PIE: 'pie',
  DOUGHNUT: 'doughnut',
  AREA: 'area',
};

// Time Periods
export const TIME_PERIODS = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly',
  YEARLY: 'yearly',
};

// Date Formats
export const DATE_FORMATS = {
  display: 'MMM dd, yyyy',
  input: 'yyyy-MM-dd',
  api: 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx',
  chart: 'MMM yyyy',
};

// Error Messages
export const ERROR_MESSAGES = {
  network: 'Network connection failed. Please check your internet connection.',
  server: 'Server is temporarily unavailable. Please try again later.',
  notFound: 'The requested data was not found.',
  timeout: 'Request timed out. Please try again.',
  generic: 'Something went wrong. Please try again.',
  noData: 'No data available for the selected criteria.',
  locationDenied: 'Location access denied. Please select your district manually.',
  locationUnavailable: 'Location detection is not available on this device.',
  invalidDistrict: 'Please select a valid district.',
  dataProcessing: 'Error processing data. Please refresh the page.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  dataLoaded: 'Data loaded successfully.',
  locationDetected: 'Location detected successfully.',
  districtChanged: 'District selection updated.',
  dataRefreshed: 'Data refreshed successfully.',
};

// Warning Messages
export const WARNING_MESSAGES = {
  oldData: 'Data may be outdated. Consider refreshing.',
  partialData: 'Some data is unavailable.',
  fallbackData: 'Using cached data due to connectivity issues.',
  locationApproximate: 'Location detection is approximate.',
};

// Info Messages
export const INFO_MESSAGES = {
  loading: 'Loading data...',
  processing: 'Processing your request...',
  detecting: 'Detecting your location...',
  updating: 'Updating data...',
  firstVisit: 'Welcome to MGNREGA Goa Dashboard!',
};

// Accessibility
export const A11Y_CONFIG = {
  // ARIA Labels
  labels: {
    navigation: 'Main navigation',
    content: 'Main content',
    metrics: 'Key performance metrics',
    charts: 'Data visualization charts',
    districtSelector: 'District selection',
    loading: 'Content is loading',
    error: 'Error message',
    success: 'Success message',
  },

  // Screen Reader Announcements
  announcements: {
    pageLoad: 'MGNREGA Goa Dashboard loaded',
    dataUpdate: 'Data has been updated',
    districtChange: 'District selection changed',
    chartLoad: 'Chart data loaded',
    error: 'An error occurred',
  },

  // Focus Management
  focus: {
    skipToContent: 'Skip to main content',
    backToTop: 'Back to top',
  },
};

// Local Storage Keys
export const STORAGE_KEYS = {
  selectedDistrict: 'mgnrega-selected-district',
  userPreferences: 'mgnrega-user-preferences',
  cacheData: 'mgnrega-cache-data',
  lastVisit: 'mgnrega-last-visit',
  appVersion: 'mgnrega-app-version',
};

// Feature Flags
export const FEATURES = {
  autoLocationDetection: true,
  chartInteractivity: true,
  dataExport: false,
  notifications: false,
  offlineMode: false,
  multiLanguage: false,
  darkMode: false,
  printMode: true,
};

// Browser Support
export const BROWSER_SUPPORT = {
  minVersions: {
    chrome: 80,
    firefox: 75,
    safari: 13,
    edge: 80,
  },
  features: {
    webGL: false,
    webWorkers: false,
    serviceWorkers: false,
    geolocation: true,
    localStorage: true,
    sessionStorage: true,
  },
};

// Development Configuration
export const DEV_CONFIG = {
  logLevel: import.meta.env.DEV ? 'debug' : 'error',
  enableReduxDevtools: import.meta.env.DEV,
  enablePerformanceMonitoring: !import.meta.env.DEV,
  mockData: import.meta.env.VITE_USE_MOCK_DATA === 'true',
  apiDelay: import.meta.env.DEV ? 500 : 0, // Simulate API delay in development
};

// External Links
export const EXTERNAL_LINKS = {
  mgnregaOfficial: 'https://nrega.nic.in/',
  goaGovernment: 'https://www.goa.gov.in/',
  dataGovIn: 'https://data.gov.in/',
  helpDesk: 'https://nrega.nic.in/Nrega_contactUs.htm',
  feedback: 'mailto:feedback@mgnrega-goa.gov.in',
};

// Social Media
export const SOCIAL_MEDIA = {
  twitter: 'https://twitter.com/mgnrega_goa',
  facebook: 'https://facebook.com/mgnrega.goa',
  youtube: 'https://youtube.com/@mgnrega-goa',
};

// Legal
export const LEGAL = {
  privacyPolicy: '/privacy-policy',
  termsOfService: '/terms-of-service',
  disclaimer: '/disclaimer',
  copyright: '© 2024 Government of Goa. All rights reserved.',
};

// Default Values
export const DEFAULTS = {
  district: DISTRICTS.NORTH_GOA.code,
  timePeriod: TIME_PERIODS.MONTHLY,
  chartType: CHART_TYPES.LINE,
  pageSize: 20,
  refreshInterval: DATA_CONFIG.refreshIntervals.metrics,
};

// Validation Rules
export const VALIDATION = {
  district: {
    required: true,
    allowedValues: Object.values(DISTRICTS).map(d => d.code),
  },
  dateRange: {
    maxDays: 365,
    minDate: new Date('2020-01-01'),
    maxDate: new Date(),
  },
};

// Export all constants as default
export default {
  APP_CONFIG,
  API_CONFIG,
  DISTRICTS,
  UI_CONFIG,
  DATA_CONFIG,
  MGNREGA_CONFIG,
  METRICS,
  CHART_TYPES,
  TIME_PERIODS,
  DATE_FORMATS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  WARNING_MESSAGES,
  INFO_MESSAGES,
  A11Y_CONFIG,
  STORAGE_KEYS,
  FEATURES,
  BROWSER_SUPPORT,
  DEV_CONFIG,
  EXTERNAL_LINKS,
  SOCIAL_MEDIA,
  LEGAL,
  DEFAULTS,
  VALIDATION,
};
