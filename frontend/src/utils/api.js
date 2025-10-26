import axios from "axios";

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API_TIMEOUT = 10000; // 10 seconds

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for logging and auth
api.interceptors.request.use(
  (config) => {
    console.log(
      `🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`,
    );
    config.metadata = { startTime: new Date() };
    return config;
  },
  (error) => {
    console.error("❌ API Request Error:", error);
    return Promise.reject(error);
  },
);

// Response interceptor for logging and error handling
api.interceptors.response.use(
  (response) => {
    const duration = new Date() - response.config.metadata.startTime;
    console.log(`✅ API Response: ${response.status} in ${duration}ms`);
    return response;
  },
  (error) => {
    const duration = error.config?.metadata?.startTime
      ? new Date() - error.config.metadata.startTime
      : 0;
    console.error(
      `❌ API Response Error: ${error.response?.status || "Network Error"} in ${duration}ms`,
    );

    // Handle specific error cases
    if (error.code === "ECONNABORTED") {
      error.message = "Request timed out. Please check your connection.";
    } else if (error.code === "NETWORK_ERROR") {
      error.message = "Network error. Please check your internet connection.";
    } else if (error.response?.status === 404) {
      error.message = "Data not found for the selected area.";
    } else if (error.response?.status >= 500) {
      error.message = "Server error. Please try again later.";
    }

    return Promise.reject(error);
  },
);

// API Functions
export const apiClient = {
  /**
   * Get server health status
   */
  async getHealth() {
    try {
      const response = await api.get("/health");
      return {
        success: true,
        data: response.data,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Health check failed",
        data: null,
        timestamp: new Date().toISOString(),
      };
    }
  },

  /**
   * Get all MGNREGA data
   */
  async getAllData() {
    try {
      const response = await api.get("/api");

      if (response.data.success) {
        return {
          success: true,
          data: response.data.data || [],
          source: response.data.source || "api",
          count: response.data.count || 0,
          timestamp: response.data.timestamp || new Date().toISOString(),
        };
      } else {
        throw new Error(response.data.message || "Failed to fetch data");
      }
    } catch (error) {
      console.warn("All data API failed, using fallback");
      return {
        success: false,
        error: error.message,
        data: generateFallbackData(),
        source: "fallback",
        timestamp: new Date().toISOString(),
      };
    }
  },

  /**
   * Get list of districts
   */
  async getDistricts() {
    try {
      const response = await api.get("/api/districts");

      if (response.data.success || response.data.districts) {
        const districts = response.data.districts || response.data.data || [];
        return {
          success: true,
          data: districts.map((district) => ({
            code:
              typeof district === "string"
                ? district.toLowerCase().replace(" ", "-")
                : district.code,
            name: typeof district === "string" ? district : district.name,
            displayName:
              typeof district === "string"
                ? district
                : district.displayName || district.name,
          })),
          source: response.data.source || "api",
          count: districts.length,
          timestamp: new Date().toISOString(),
        };
      } else {
        throw new Error(response.data.message || "Failed to fetch districts");
      }
    } catch (error) {
      console.warn("Districts API failed, using fallback");
      return {
        success: false,
        error: error.message,
        data: [
          { code: "north-goa", name: "North Goa", displayName: "North Goa" },
          { code: "south-goa", name: "South Goa", displayName: "South Goa" },
        ],
        source: "fallback",
        timestamp: new Date().toISOString(),
      };
    }
  },

  /**
   * Get data for specific district
   * @param {string} districtName - Name of the district
   */
  async getDistrictData(districtName) {
    try {
      const encodedDistrict = encodeURIComponent(districtName);
      const response = await api.get(`/api/data/${encodedDistrict}`);

      if (response.data.success || response.data.data) {
        return {
          success: true,
          data: response.data.data || [],
          district: response.data.district || districtName,
          source: response.data.source || "api",
          count: Array.isArray(response.data.data)
            ? response.data.data.length
            : 0,
          timestamp: response.data.timestamp || new Date().toISOString(),
        };
      } else {
        throw new Error(
          response.data.message || `No data found for ${districtName}`,
        );
      }
    } catch (error) {
      console.warn(
        `District data API failed for ${districtName}, using fallback`,
      );
      return {
        success: false,
        error: error.message,
        data: generateFallbackDistrictData(districtName),
        district: districtName,
        source: "fallback",
        timestamp: new Date().toISOString(),
      };
    }
  },

  /**
   * Refresh data with cache bypass
   * @param {string} endpoint - Endpoint to refresh
   */
  async refreshData(endpoint) {
    try {
      const response = await api.get(endpoint, {
        params: { _t: Date.now() }, // Cache buster
        headers: { "Cache-Control": "no-cache" },
      });
      return {
        success: true,
        data: response.data,
        refreshed: true,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        refreshed: false,
        timestamp: new Date().toISOString(),
      };
    }
  },
};

// Data Processing Functions
export const dataProcessors = {
  /**
   * Process raw MGNREGA data into metrics
   * @param {Array} rawData - Raw data from API
   * @returns {Object} Processed metrics
   */
  processMetrics(rawData) {
    if (!Array.isArray(rawData) || rawData.length === 0) {
      return {
        totalPersonDays: 0,
        totalHouseholds: 0,
        totalFundsSpent: 0,
        averageWage: 0,
        completionRate: 0,
        employmentGenerated: 0,
        workEfficiency: 0,
      };
    }

    const totals = rawData.reduce(
      (acc, record) => {
        acc.personDays += parseInt(record.person_days || 0);
        acc.households += parseInt(record.households || 0);
        acc.fundsSpent += parseFloat(record.funds_spent || 0);
        acc.records += 1;
        return acc;
      },
      { personDays: 0, households: 0, fundsSpent: 0, records: 0 },
    );

    // Calculate derived metrics
    const averageWage =
      totals.personDays > 0 ? totals.fundsSpent / totals.personDays : 0;
    const completionRate = Math.min(95, 70 + Math.random() * 25); // Mock completion rate
    const workEfficiency =
      totals.households > 0 ? totals.personDays / totals.households : 0;

    return {
      totalPersonDays: totals.personDays,
      totalHouseholds: totals.households,
      totalFundsSpent: totals.fundsSpent,
      averageWage: Math.round(averageWage),
      completionRate: Math.round(completionRate),
      employmentGenerated: totals.households,
      workEfficiency: Math.round(workEfficiency),
      dataQuality:
        totals.records > 10 ? "high" : totals.records > 5 ? "medium" : "low",
    };
  },

  /**
   * Process data for trend charts
   * @param {Array} rawData - Raw data from API
   * @returns {Array} Chart data
   */
  processChartData(rawData) {
    if (!Array.isArray(rawData) || rawData.length === 0) {
      return generateMockChartData();
    }

    // Group data by month and year
    const monthlyData = rawData.reduce((acc, record) => {
      const month = parseInt(record.month) || new Date().getMonth() + 1;
      const year = parseInt(record.year) || new Date().getFullYear();
      const key = `${year}-${month.toString().padStart(2, "0")}`;

      if (!acc[key]) {
        acc[key] = {
          month,
          year,
          key,
          personDays: 0,
          households: 0,
          fundsSpent: 0,
          records: 0,
        };
      }

      acc[key].personDays += parseInt(record.person_days || 0);
      acc[key].households += parseInt(record.households || 0);
      acc[key].fundsSpent += parseFloat(record.funds_spent || 0);
      acc[key].records += 1;

      return acc;
    }, {});

    // Convert to array and sort by date
    const chartData = Object.values(monthlyData)
      .sort((a, b) => a.key.localeCompare(b.key))
      .map((item) => ({
        ...item,
        monthName: getMonthName(item.month),
        label: `${getMonthName(item.month).substr(0, 3)} ${item.year}`,
        date: new Date(item.year, item.month - 1, 1),
      }));

    return chartData.length > 0 ? chartData : generateMockChartData();
  },

  /**
   * Process data for district comparison
   * @param {Array} northGoaData - North Goa data
   * @param {Array} southGoaData - South Goa data
   * @returns {Array} Comparison data
   */
  processComparisonData(northGoaData = [], southGoaData = []) {
    const northMetrics = this.processMetrics(northGoaData);
    const southMetrics = this.processMetrics(southGoaData);

    const totalPersonDays =
      northMetrics.totalPersonDays + southMetrics.totalPersonDays;
    const totalHouseholds =
      northMetrics.totalHouseholds + southMetrics.totalHouseholds;
    const totalFunds =
      northMetrics.totalFundsSpent + southMetrics.totalFundsSpent;

    return [
      {
        district: "North Goa",
        personDays: northMetrics.totalPersonDays,
        households: northMetrics.totalHouseholds,
        fundsSpent: northMetrics.totalFundsSpent,
        personDaysPercentage:
          totalPersonDays > 0
            ? Math.round((northMetrics.totalPersonDays / totalPersonDays) * 100)
            : 50,
        householdsPercentage:
          totalHouseholds > 0
            ? Math.round((northMetrics.totalHouseholds / totalHouseholds) * 100)
            : 45,
        fundsPercentage:
          totalFunds > 0
            ? Math.round((northMetrics.totalFundsSpent / totalFunds) * 100)
            : 48,
        completionRate: northMetrics.completionRate,
        efficiency: northMetrics.workEfficiency,
      },
      {
        district: "South Goa",
        personDays: southMetrics.totalPersonDays,
        households: southMetrics.totalHouseholds,
        fundsSpent: southMetrics.totalFundsSpent,
        personDaysPercentage:
          totalPersonDays > 0
            ? Math.round((southMetrics.totalPersonDays / totalPersonDays) * 100)
            : 50,
        householdsPercentage:
          totalHouseholds > 0
            ? Math.round((southMetrics.totalHouseholds / totalHouseholds) * 100)
            : 55,
        fundsPercentage:
          totalFunds > 0
            ? Math.round((southMetrics.totalFundsSpent / totalFunds) * 100)
            : 52,
        completionRate: southMetrics.completionRate,
        efficiency: southMetrics.workEfficiency,
      },
    ];
  },

  /**
   * Calculate percentage change between two periods
   * @param {number} current - Current value
   * @param {number} previous - Previous value
   * @returns {Object} Change data
   */
  calculateChange(current, previous) {
    if (!previous || previous === 0) {
      return {
        percentage: 0,
        type: "neutral",
        text: "No previous data",
        description: "First time data",
      };
    }

    const change = ((current - previous) / previous) * 100;
    const roundedChange = Math.round(Math.abs(change));

    return {
      percentage: roundedChange,
      type: change > 0 ? "positive" : change < 0 ? "negative" : "neutral",
      text:
        change > 0
          ? `+${roundedChange}%`
          : change < 0
            ? `-${roundedChange}%`
            : "0%",
      description:
        change > 5
          ? "significant increase"
          : change > 0
            ? "slight increase"
            : change < -5
              ? "significant decrease"
              : change < 0
                ? "slight decrease"
                : "no change",
      raw: change,
    };
  },

  /**
   * Generate insights from data trends
   * @param {Array} chartData - Chart data points
   * @returns {Object} Insights
   */
  generateInsights(chartData) {
    if (!chartData || chartData.length < 2) {
      return {
        trend: "insufficient_data",
        message: "Need more data points to generate insights",
        confidence: "low",
      };
    }

    const recent = chartData.slice(-3);
    const earlier = chartData.slice(0, -3);

    const recentAvg =
      recent.reduce((sum, d) => sum + d.personDays, 0) / recent.length;
    const earlierAvg =
      earlier.length > 0
        ? earlier.reduce((sum, d) => sum + d.personDays, 0) / earlier.length
        : recentAvg;

    const change = ((recentAvg - earlierAvg) / earlierAvg) * 100;

    let trend, message, confidence;

    if (change > 15) {
      trend = "strong_growth";
      message = "📈 Excellent progress! Employment is growing rapidly.";
      confidence = "high";
    } else if (change > 5) {
      trend = "growth";
      message = "📈 Steady improvement in employment generation.";
      confidence = "high";
    } else if (change > -5) {
      trend = "stable";
      message = "📊 Employment levels are stable.";
      confidence = "medium";
    } else if (change > -15) {
      trend = "decline";
      message = "📉 Employment shows some decline. Needs attention.";
      confidence = "high";
    } else {
      trend = "strong_decline";
      message =
        "📉 Significant decline in employment. Immediate action needed.";
      confidence = "high";
    }

    return { trend, message, confidence, changePercent: Math.round(change) };
  },
};

// Formatting Functions
export const formatters = {
  /**
   * Format numbers for display (Indian numbering system)
   * @param {number} num - Number to format
   * @returns {string} Formatted number
   */
  formatNumber(num) {
    if (num === null || num === undefined || isNaN(num)) {
      return "0";
    }

    const absNum = Math.abs(num);

    if (absNum >= 10000000) {
      return `${(num / 10000000).toFixed(1)} Crore`;
    }

    if (absNum >= 100000) {
      return `${(num / 100000).toFixed(1)} Lakh`;
    }

    if (absNum >= 1000) {
      return num.toLocaleString("en-IN");
    }

    return Math.round(num).toString();
  },

  /**
   * Format currency (Indian Rupees)
   * @param {number} amount - Amount to format
   * @returns {string} Formatted currency
   */
  formatCurrency(amount) {
    if (amount === null || amount === undefined || isNaN(amount)) {
      return "₹0";
    }

    return `₹${this.formatNumber(amount)}`;
  },

  /**
   * Format percentage
   * @param {number} percentage - Percentage to format
   * @returns {string} Formatted percentage
   */
  formatPercentage(percentage) {
    if (percentage === null || percentage === undefined || isNaN(percentage)) {
      return "0%";
    }

    return `${Math.round(percentage)}%`;
  },

  /**
   * Format date for display
   * @param {string|Date} date - Date to format
   * @returns {string} Formatted date
   */
  formatDate(date) {
    if (!date) return "N/A";

    try {
      const dateObj = typeof date === "string" ? new Date(date) : date;
      return dateObj.toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  },

  /**
   * Format relative time (e.g., "2 hours ago")
   * @param {string|Date} date - Date to format
   * @returns {string} Relative time
   */
  formatRelativeTime(date) {
    if (!date) return "Unknown";

    try {
      const now = new Date();
      const dateObj = typeof date === "string" ? new Date(date) : date;
      const diffMs = now - dateObj;
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMinutes / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMinutes < 1) {
        return "Just now";
      } else if (diffMinutes < 60) {
        return `${diffMinutes} minute${diffMinutes !== 1 ? "s" : ""} ago`;
      } else if (diffHours < 24) {
        return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
      } else if (diffDays < 30) {
        return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
      } else {
        return this.formatDate(dateObj);
      }
    } catch {
      return "Unknown";
    }
  },

  /**
   * Format numbers for screen readers
   * @param {number} num - Number to format
   * @param {string} unit - Unit (e.g., 'days', 'families')
   * @returns {string} Screen reader friendly text
   */
  formatForScreenReader(num, unit = "") {
    const formatted = this.formatNumber(num);

    // Convert abbreviated numbers to full text
    const screenReaderText = formatted
      .replace(" Crore", " crores")
      .replace(" Lakh", " lakhs");

    return unit ? `${screenReaderText} ${unit}` : screenReaderText;
  },
};

// Fallback Data Generation
function generateFallbackData() {
  const districts = ["North Goa", "South Goa"];
  const data = [];

  districts.forEach((district) => {
    for (let month = 1; month <= 12; month++) {
      for (let year = 2023; year <= 2024; year++) {
        data.push({
          district,
          month,
          year,
          person_days: Math.floor(Math.random() * 5000) + 1000,
          households: Math.floor(Math.random() * 300) + 100,
          funds_spent: Math.floor(Math.random() * 1000000) + 200000,
          scheme_name: "MGNREGA",
          block_name: `${district} Block`,
          panchayat_name: `${district} Panchayat`,
        });
      }
    }
  });

  return data;
}

function generateFallbackDistrictData(districtName) {
  const data = [];

  for (let month = 1; month <= 12; month++) {
    for (let year = 2023; year <= 2024; year++) {
      data.push({
        district: districtName,
        month,
        year,
        person_days: Math.floor(Math.random() * 3000) + 800,
        households: Math.floor(Math.random() * 200) + 80,
        funds_spent: Math.floor(Math.random() * 600000) + 150000,
        scheme_name: "MGNREGA",
        block_name: `${districtName} Block`,
        panchayat_name: `${districtName} Panchayat`,
      });
    }
  }

  return data;
}

function generateMockChartData() {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return months.map((monthName, index) => {
    const month = index + 1;
    const year = 2024;
    const baseValue = 1000 + month * 100;
    const variance = Math.random() * 500;

    return {
      month,
      year,
      key: `${year}-${month.toString().padStart(2, "0")}`,
      monthName,
      label: `${monthName.substr(0, 3)} ${year}`,
      personDays: Math.floor(baseValue + variance),
      households: Math.floor((baseValue + variance) / 5),
      fundsSpent: Math.floor((baseValue + variance) * 200),
      records: 1,
      date: new Date(year, month - 1, 1),
    };
  });
}

function getMonthName(monthNumber) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return months[monthNumber - 1] || "Unknown";
}

// Utility Functions
export const helpers = {
  /**
   * Debounce function calls
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in milliseconds
   * @returns {Function} Debounced function
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * Generate unique ID
   * @returns {string} Unique ID
   */
  generateId() {
    return `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  },

  /**
   * Check if device is mobile
   * @returns {boolean} Is mobile device
   */
  isMobile() {
    return window.innerWidth < 768;
  },

  /**
   * Sleep/delay function
   * @param {number} ms - Milliseconds to sleep
   * @returns {Promise} Promise that resolves after delay
   */
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  },

  /**
   * Retry function with exponential backoff
   * @param {Function} fn - Function to retry
   * @param {number} maxRetries - Maximum retries
   * @param {number} baseDelay - Base delay in ms
   * @returns {Promise} Result of function
   */
  async retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {
    for (let i = 0; i <= maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        if (i === maxRetries) throw error;

        const delay = baseDelay * Math.pow(2, i);
        console.log(`Retry ${i + 1}/${maxRetries} after ${delay}ms`);
        await this.sleep(delay);
      }
    }
  },
};

// Export default API client
export default apiClient;
