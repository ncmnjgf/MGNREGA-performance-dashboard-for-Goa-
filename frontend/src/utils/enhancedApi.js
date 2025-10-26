/**
 * Enhanced API Service for MGNREGA Goa Dashboard
 * Integrates with offline storage, provides intelligent caching, and robust fallback strategies
 */

import axios from 'axios';
import { offlineStorage } from './offlineStorage';
import { geolocationService } from './geolocation';
import { API_CONFIG, ERROR_MESSAGES, SUCCESS_MESSAGES, DISTRICTS } from './constants';

// Network status tracking
let isOnline = navigator.onLine;
let lastOnlineTime = Date.now();

// Update network status
window.addEventListener('online', () => {
  isOnline = true;
  lastOnlineTime = Date.now();
  console.log('🌐 Back online - processing offline queue');
  processOfflineQueue();
});

window.addEventListener('offline', () => {
  isOnline = false;
  console.log('📱 Gone offline - switching to cache mode');
});

// Create enhanced axios instance
const api = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

// Request interceptor with offline handling
api.interceptors.request.use(
  (config) => {
    config.metadata = {
      startTime: Date.now(),
      cacheKey: generateCacheKey(config),
      retryCount: config.retryCount || 0,
    };

    console.log(`🌐 API Request: ${config.method?.toUpperCase()} ${config.url} (attempt ${config.metadata.retryCount + 1})`);

    // Add user agent and version info
    config.headers['X-App-Version'] = '1.0.0';
    config.headers['X-User-Agent'] = navigator.userAgent;

    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor with caching and error enhancement
api.interceptors.response.use(
  (response) => {
    const duration = Date.now() - response.config.metadata.startTime;
    console.log(`✅ API Response: ${response.status} in ${duration}ms`);

    // Cache successful responses
    if (response.status === 200 && response.data) {
      const cacheKey = response.config.metadata.cacheKey;
      const maxAge = getCacheMaxAge(response.config.url);

      offlineStorage.set(cacheKey, {
        data: response.data,
        status: response.status,
        headers: response.headers,
        url: response.config.url,
      }, {
        source: 'api',
        maxAge,
      });

      // Update last sync time
      offlineStorage.updateLastSync();
    }

    return response;
  },
  async (error) => {
    const duration = error.config?.metadata?.startTime
      ? Date.now() - error.config.metadata.startTime
      : 0;

    console.error(`❌ API Error: ${error.response?.status || error.code} in ${duration}ms`);

    // Handle retry logic
    const shouldRetry = shouldRetryRequest(error);
    if (shouldRetry && error.config.metadata.retryCount < API_CONFIG.retryAttempts) {
      return retryRequest(error.config);
    }

    // Enhance error with user-friendly message
    const enhancedError = enhanceApiError(error);

    // Try to serve from cache if available
    const cachedResponse = await tryServingFromCache(error.config);
    if (cachedResponse) {
      console.log('📱 Serving cached response due to API failure');
      return cachedResponse;
    }

    return Promise.reject(enhancedError);
  }
);

/**
 * Generate cache key for request
 * @param {Object} config - Axios config
 * @returns {string} Cache key
 */
const generateCacheKey = (config) => {
  const url = config.url || '';
  const method = config.method || 'get';
  const params = JSON.stringify(config.params || {});
  return `api-cache-${method}-${url}-${btoa(params)}`;
};

/**
 * Get appropriate cache max age for different endpoints
 * @param {string} url - Request URL
 * @returns {number} Max age in milliseconds
 */
const getCacheMaxAge = (url) => {
  if (url.includes('/districts')) {
    return 24 * 60 * 60 * 1000; // 24 hours for district data
  } else if (url.includes('/api/data/')) {
    return 2 * 60 * 60 * 1000; // 2 hours for district-specific data
  } else if (url.includes('/api')) {
    return 30 * 60 * 1000; // 30 minutes for general API data
  } else if (url.includes('/health')) {
    return 5 * 60 * 1000; // 5 minutes for health checks
  }
  return 10 * 60 * 1000; // 10 minutes default
};

/**
 * Check if request should be retried
 * @param {Error} error - Request error
 * @returns {boolean} Should retry
 */
const shouldRetryRequest = (error) => {
  // Don't retry on client errors (4xx)
  if (error.response?.status >= 400 && error.response?.status < 500) {
    return false;
  }

  // Retry on network errors, timeouts, and server errors
  return (
    error.code === 'ECONNABORTED' ||
    error.code === 'NETWORK_ERROR' ||
    !error.response ||
    error.response.status >= 500
  );
};

/**
 * Retry request with exponential backoff
 * @param {Object} config - Original request config
 * @returns {Promise} Retry promise
 */
const retryRequest = async (config) => {
  const retryCount = config.metadata.retryCount + 1;
  const delay = Math.min(1000 * Math.pow(2, retryCount), 10000); // Max 10 seconds

  console.log(`🔄 Retrying request in ${delay}ms (attempt ${retryCount})`);

  await new Promise(resolve => setTimeout(resolve, delay));

  config.metadata.retryCount = retryCount;
  return api(config);
};

/**
 * Try serving response from cache
 * @param {Object} config - Request config
 * @returns {Promise|null} Cached response or null
 */
const tryServingFromCache = async (config) => {
  const cacheKey = generateCacheKey(config);
  const cached = offlineStorage.get(cacheKey);

  if (cached && cached.data) {
    // Create axios-compatible response
    return {
      data: cached.data,
      status: cached.status || 200,
      statusText: 'OK (Cached)',
      headers: cached.headers || {},
      config,
      request: {},
      cached: true,
    };
  }

  return null;
};

/**
 * Enhance API error with user-friendly message
 * @param {Error} error - Original error
 * @returns {Error} Enhanced error
 */
const enhanceApiError = (error) => {
  const enhancedError = new Error(error.message);
  enhancedError.original = error;
  enhancedError.isApiError = true;

  if (error.code === 'ECONNABORTED') {
    enhancedError.message = ERROR_MESSAGES.timeout;
    enhancedError.userFriendly = true;
    enhancedError.recoverable = true;
  } else if (error.code === 'NETWORK_ERROR' || !error.response) {
    enhancedError.message = ERROR_MESSAGES.network;
    enhancedError.userFriendly = true;
    enhancedError.recoverable = true;
  } else if (error.response?.status === 404) {
    enhancedError.message = ERROR_MESSAGES.notFound;
    enhancedError.userFriendly = true;
    enhancedError.recoverable = false;
  } else if (error.response?.status >= 500) {
    enhancedError.message = ERROR_MESSAGES.server;
    enhancedError.userFriendly = true;
    enhancedError.recoverable = true;
  } else {
    enhancedError.message = ERROR_MESSAGES.generic;
    enhancedError.userFriendly = true;
    enhancedError.recoverable = true;
  }

  return enhancedError;
};

/**
 * Process offline queue when back online
 */
const processOfflineQueue = async () => {
  if (!isOnline) return;

  const queue = offlineStorage.getOfflineQueue();
  if (queue.length === 0) return;

  console.log(`🔄 Processing ${queue.length} offline requests`);

  await offlineStorage.processOfflineQueue(async (request) => {
    try {
      const response = await api(request.config);
      console.log(`✅ Offline request processed: ${request.config.method} ${request.config.url}`);
      return response;
    } catch (error) {
      console.error(`❌ Failed to process offline request: ${error.message}`);
      throw error;
    }
  });
};

/**
 * Enhanced API client with offline capabilities
 */
export const enhancedApiClient = {
  /**
   * Get server health status with enhanced offline handling
   */
  async getHealth() {
    const cacheKey = 'health-status';

    try {
      const response = await api.get('/health');
      const healthData = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        online: true,
        ...response.data,
      };

      // Cache health status
      offlineStorage.set(cacheKey, healthData, {
        source: 'api',
        maxAge: 5 * 60 * 1000, // 5 minutes
      });

      return {
        success: true,
        data: healthData,
      };
    } catch (error) {
      console.warn('Health check failed, using cached data or fallback');

      // Try cached health data
      const cachedHealth = offlineStorage.get(cacheKey);
      if (cachedHealth) {
        return {
          success: true,
          data: {
            ...cachedHealth,
            online: false,
            cached: true,
          },
        };
      }

      // Fallback health status
      return {
        success: false,
        data: {
          status: 'offline',
          timestamp: new Date().toISOString(),
          online: false,
          error: error.message,
        },
        error: error.message,
      };
    }
  },

  /**
   * Get all MGNREGA data with intelligent caching
   */
  async getAllData(options = {}) {
    const cacheKey = 'all-mgnrega-data';
    const forceRefresh = options.forceRefresh || false;

    // Check cache first if not forcing refresh
    if (!forceRefresh && !isOnline) {
      const cachedData = offlineStorage.getApiData();
      if (cachedData) {
        console.log('📱 Serving all data from offline cache');
        return {
          success: true,
          data: cachedData,
          source: 'cache',
          offline: true,
          timestamp: new Date().toISOString(),
        };
      }
    }

    try {
      const response = await api.get('/api');

      if (response.data.success) {
        const apiData = response.data.data || [];

        // Store in offline cache
        offlineStorage.storeApiData(apiData, 'api');

        return {
          success: true,
          data: apiData,
          source: response.data.source || 'api',
          count: response.data.count || apiData.length,
          timestamp: response.data.timestamp || new Date().toISOString(),
          cached: response.cached || false,
        };
      } else {
        throw new Error(response.data.message || 'Failed to fetch data');
      }
    } catch (error) {
      console.warn('All data API failed, trying fallback strategies');

      // Try offline cache
      const cachedData = offlineStorage.getApiData();
      if (cachedData) {
        console.log('📱 Using cached API data as fallback');
        return {
          success: true,
          data: cachedData,
          source: 'cache',
          offline: true,
          timestamp: new Date().toISOString(),
          error: error.message,
        };
      }

      // Queue request for when online
      if (!isOnline) {
        offlineStorage.addToOfflineQueue({
          config: { method: 'get', url: '/api' },
          type: 'getAllData',
        });
      }

      // Generate fallback data
      const fallbackData = generateFallbackData();
      offlineStorage.storeApiData(fallbackData, 'fallback');

      return {
        success: false,
        data: fallbackData,
        source: 'fallback',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  },

  /**
   * Get districts with caching
   */
  async getDistricts() {
    const cacheKey = 'districts-list';

    try {
      const response = await api.get('/api/districts');

      if (response.data.success || response.data.districts) {
        const districts = response.data.districts || response.data.data || [];
        const processedDistricts = districts.map(district => ({
          code: typeof district === 'string'
            ? district.toLowerCase().replace(' ', '-')
            : district.code,
          name: typeof district === 'string' ? district : district.name,
          displayName: typeof district === 'string'
            ? district
            : district.displayName || district.name,
        }));

        return {
          success: true,
          data: processedDistricts,
          source: response.data.source || 'api',
          count: processedDistricts.length,
          timestamp: new Date().toISOString(),
          cached: response.cached || false,
        };
      } else {
        throw new Error(response.data.message || 'Failed to fetch districts');
      }
    } catch (error) {
      console.warn('Districts API failed, using fallback');

      // Try cached districts
      const cached = offlineStorage.get(cacheKey);
      if (cached) {
        return {
          success: true,
          data: cached,
          source: 'cache',
          offline: true,
          timestamp: new Date().toISOString(),
        };
      }

      // Fallback to static district list
      const fallbackDistricts = [
        { code: 'north-goa', name: 'North Goa', displayName: 'North Goa' },
        { code: 'south-goa', name: 'South Goa', displayName: 'South Goa' },
      ];

      offlineStorage.set(cacheKey, fallbackDistricts, { source: 'fallback' });

      return {
        success: false,
        data: fallbackDistricts,
        source: 'fallback',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  },

  /**
   * Get district-specific data with location integration
   */
  async getDistrictData(districtCode, options = {}) {
    const autoDetect = options.autoDetect || false;
    let targetDistrict = districtCode;

    // Auto-detect district if requested and no district provided
    if (autoDetect && !districtCode) {
      try {
        const locationResult = await geolocationService.detectUserLocationAndDistrict();
        if (locationResult.district) {
          targetDistrict = locationResult.district.code;
          console.log(`🌍 Auto-detected district: ${locationResult.district.name}`);
        }
      } catch (error) {
        console.warn('Auto-detection failed:', error.message);
        // Use cached district if available
        const cachedDistrict = geolocationService.getCachedDistrict();
        if (cachedDistrict) {
          targetDistrict = cachedDistrict.code;
        }
      }
    }

    if (!targetDistrict) {
      throw new Error('No district specified and auto-detection failed');
    }

    const cacheKey = `district-data-${targetDistrict}`;

    try {
      const response = await api.get(`/api/data/${targetDistrict}`);

      if (response.data.success) {
        const districtData = response.data.data || [];

        // Cache district-specific data
        offlineStorage.storeDistrictData(targetDistrict, districtData, 'api');

        return {
          success: true,
          data: districtData,
          district: targetDistrict,
          source: response.data.source || 'api',
          count: response.data.count || districtData.length,
          timestamp: response.data.timestamp || new Date().toISOString(),
          cached: response.cached || false,
          autoDetected: autoDetect && !districtCode,
        };
      } else {
        throw new Error(response.data.message || 'Failed to fetch district data');
      }
    } catch (error) {
      console.warn(`District data API failed for ${targetDistrict}, trying fallback`);

      // Try cached district data
      const cachedData = offlineStorage.getDistrictData(targetDistrict);
      if (cachedData) {
        console.log(`📱 Using cached data for ${targetDistrict}`);
        return {
          success: true,
          data: cachedData,
          district: targetDistrict,
          source: 'cache',
          offline: true,
          timestamp: new Date().toISOString(),
          autoDetected: autoDetect && !districtCode,
        };
      }

      // Queue request for when online
      if (!isOnline) {
        offlineStorage.addToOfflineQueue({
          config: { method: 'get', url: `/api/data/${targetDistrict}` },
          type: 'getDistrictData',
          district: targetDistrict,
        });
      }

      // Generate fallback district data
      const fallbackData = generateFallbackDistrictData(targetDistrict);
      offlineStorage.storeDistrictData(targetDistrict, fallbackData, 'fallback');

      return {
        success: false,
        data: fallbackData,
        district: targetDistrict,
        source: 'fallback',
        error: error.message,
        timestamp: new Date().toISOString(),
        autoDetected: autoDetect && !districtCode,
      };
    }
  },

  /**
   * Refresh all data and clear cache
   */
  async refreshData(options = {}) {
    const clearCache = options.clearCache !== false;

    console.log('🔄 Refreshing all data...');

    if (clearCache) {
      // Clear API-related cache
      offlineStorage.clear(false); // Keep user preferences
    }

    try {
      // Fetch fresh data in parallel
      const [healthResult, allDataResult, districtsResult] = await Promise.allSettled([
        this.getHealth(),
        this.getAllData({ forceRefresh: true }),
        this.getDistricts(),
      ]);

      const results = {
        health: healthResult.status === 'fulfilled' ? healthResult.value : { success: false, error: healthResult.reason?.message },
        allData: allDataResult.status === 'fulfilled' ? allDataResult.value : { success: false, error: allDataResult.reason?.message },
        districts: districtsResult.status === 'fulfilled' ? districtsResult.value : { success: false, error: districtsResult.reason?.message },
      };

      const successCount = Object.values(results).filter(r => r.success).length;

      return {
        success: successCount > 0,
        results,
        refreshedAt: new Date().toISOString(),
        successCount,
        totalCount: 3,
      };
    } catch (error) {
      console.error('❌ Data refresh failed:', error);
      return {
        success: false,
        error: error.message,
        refreshedAt: new Date().toISOString(),
      };
    }
  },

  /**
   * Get cache and network status
   */
  getCacheStatus() {
    return {
      ...offlineStorage.getStatus(),
      network: {
        online: isOnline,
        lastOnlineTime: new Date(lastOnlineTime).toISOString(),
      },
      api: {
        baseURL: API_CONFIG.baseURL,
        timeout: API_CONFIG.timeout,
      },
    };
  },

  /**
   * Clear all cached data
   */
  clearCache(keepUserPrefs = true) {
    return offlineStorage.clear(keepUserPrefs);
  },
};

// Generate fallback data when API is unavailable
function generateFallbackData() {
  const currentDate = new Date();
  const monthsBack = 6;

  const fallbackData = [];

  for (let i = 0; i < monthsBack; i++) {
    const date = new Date(currentDate);
    date.setMonth(date.getMonth() - i);

    fallbackData.push({
      district: 'North Goa',
      person_days: Math.floor(Math.random() * 5000) + 10000,
      households: Math.floor(Math.random() * 1000) + 2000,
      funds_spent: Math.floor(Math.random() * 1000000) + 5000000,
      completion_rate: Math.floor(Math.random() * 30) + 70,
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      date: date.toISOString().split('T')[0],
    });

    fallbackData.push({
      district: 'South Goa',
      person_days: Math.floor(Math.random() * 4000) + 8000,
      households: Math.floor(Math.random() * 800) + 1500,
      funds_spent: Math.floor(Math.random() * 800000) + 4000000,
      completion_rate: Math.floor(Math.random() * 25) + 75,
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      date: date.toISOString().split('T')[0],
    });
  }

  return fallbackData.reverse();
}

// Generate fallback data for specific district
function generateFallbackDistrictData(districtCode) {
  const allData = generateFallbackData();
  const districtName = districtCode === 'north-goa' ? 'North Goa' : 'South Goa';
  return allData.filter(item => item.district === districtName);
}

export default enhancedApiClient;
