/**
 * Offline Storage Utility for MGNREGA Goa Dashboard
 * Handles caching, offline data management, and fallback strategies
 */

import { STORAGE_KEYS, DATA_CONFIG } from './constants';

// Storage keys for different data types
const CACHE_KEYS = {
  API_DATA: 'mgnrega-api-cache',
  DISTRICT_DATA: 'mgnrega-district-cache',
  METADATA: 'mgnrega-cache-metadata',
  OFFLINE_QUEUE: 'mgnrega-offline-queue',
  USER_PREFERENCES: 'mgnrega-user-prefs',
  LAST_SYNC: 'mgnrega-last-sync',
};

// Cache entry structure
const createCacheEntry = (data, source = 'api', expiresAt = null) => ({
  data,
  source,
  timestamp: Date.now(),
  expiresAt: expiresAt || Date.now() + DATA_CONFIG.cache.maxAge,
  version: '1.0',
});

// Storage quota management
const STORAGE_QUOTA = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  CLEANUP_THRESHOLD: 8 * 1024 * 1024, // 8MB
};

/**
 * Check if localStorage is available and working
 * @returns {boolean} True if localStorage is available
 */
export const isStorageAvailable = () => {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Calculate approximate storage usage
 * @returns {number} Storage usage in bytes
 */
export const getStorageUsage = () => {
  if (!isStorageAvailable()) return 0;

  let total = 0;
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key) && key.startsWith('mgnrega-')) {
      total += localStorage[key].length + key.length;
    }
  }
  return total;
};

/**
 * Clean up expired cache entries
 */
export const cleanupExpiredCache = () => {
  if (!isStorageAvailable()) return;

  const now = Date.now();
  const keysToRemove = [];

  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key) && key.startsWith('mgnrega-')) {
      try {
        const data = JSON.parse(localStorage[key]);
        if (data.expiresAt && data.expiresAt < now) {
          keysToRemove.push(key);
        }
      } catch (e) {
        // Invalid JSON, mark for removal
        keysToRemove.push(key);
      }
    }
  }

  keysToRemove.forEach(key => localStorage.removeItem(key));

  console.log(`🧹 Cleaned up ${keysToRemove.length} expired cache entries`);
};

/**
 * Clean up old cache entries when storage is full
 */
export const cleanupOldCache = () => {
  if (!isStorageAvailable()) return;

  const entries = [];

  // Collect all cache entries with timestamps
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key) && key.startsWith('mgnrega-')) {
      try {
        const data = JSON.parse(localStorage[key]);
        entries.push({ key, timestamp: data.timestamp || 0, size: localStorage[key].length });
      } catch (e) {
        entries.push({ key, timestamp: 0, size: localStorage[key].length });
      }
    }
  }

  // Sort by timestamp (oldest first)
  entries.sort((a, b) => a.timestamp - b.timestamp);

  // Remove oldest entries until under cleanup threshold
  let currentSize = getStorageUsage();
  let removedCount = 0;

  while (currentSize > STORAGE_QUOTA.CLEANUP_THRESHOLD && entries.length > removedCount) {
    const entry = entries[removedCount];
    localStorage.removeItem(entry.key);
    currentSize -= entry.size;
    removedCount++;
  }

  console.log(`🧹 Cleaned up ${removedCount} old cache entries to free space`);
};

/**
 * Store data in cache with automatic cleanup
 * @param {string} key - Storage key
 * @param {*} data - Data to store
 * @param {Object} options - Storage options
 */
export const setCache = (key, data, options = {}) => {
  if (!isStorageAvailable()) {
    console.warn('⚠️ localStorage not available, data not cached');
    return false;
  }

  try {
    // Create cache entry
    const cacheEntry = createCacheEntry(
      data,
      options.source || 'api',
      options.expiresAt || Date.now() + (options.maxAge || DATA_CONFIG.cache.maxAge)
    );

    const serialized = JSON.stringify(cacheEntry);

    // Check if we need to clean up space
    const currentSize = getStorageUsage();
    if (currentSize + serialized.length > STORAGE_QUOTA.MAX_SIZE) {
      cleanupExpiredCache();

      // If still too big, clean up old entries
      if (getStorageUsage() + serialized.length > STORAGE_QUOTA.MAX_SIZE) {
        cleanupOldCache();
      }
    }

    localStorage.setItem(key, serialized);

    // Update metadata
    updateCacheMetadata(key, {
      lastUpdated: Date.now(),
      size: serialized.length,
      source: options.source || 'api',
    });

    console.log(`💾 Cached data for key: ${key} (${Math.round(serialized.length / 1024)}KB)`);
    return true;
  } catch (error) {
    console.error('❌ Failed to cache data:', error);

    // Try to recover by cleaning up and retrying
    try {
      cleanupExpiredCache();
      cleanupOldCache();
      localStorage.setItem(key, JSON.stringify(createCacheEntry(data)));
      return true;
    } catch (retryError) {
      console.error('❌ Failed to cache data even after cleanup:', retryError);
      return false;
    }
  }
};

/**
 * Get data from cache
 * @param {string} key - Storage key
 * @param {Object} options - Retrieval options
 * @returns {*} Cached data or null
 */
export const getCache = (key, options = {}) => {
  if (!isStorageAvailable()) return null;

  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const cacheEntry = JSON.parse(cached);

    // Check if expired
    if (cacheEntry.expiresAt && cacheEntry.expiresAt < Date.now()) {
      localStorage.removeItem(key);
      console.log(`🗑️ Removed expired cache entry: ${key}`);
      return null;
    }

    // Check max age override
    if (options.maxAge && cacheEntry.timestamp + options.maxAge < Date.now()) {
      return null;
    }

    console.log(`💾 Retrieved cached data for key: ${key} (source: ${cacheEntry.source})`);
    return cacheEntry.data;
  } catch (error) {
    console.error('❌ Failed to retrieve cached data:', error);
    // Remove corrupted cache entry
    try {
      localStorage.removeItem(key);
    } catch (e) {
      // Ignore cleanup errors
    }
    return null;
  }
};

/**
 * Check if cache entry exists and is valid
 * @param {string} key - Storage key
 * @returns {boolean} True if cache is valid
 */
export const isCacheValid = (key) => {
  if (!isStorageAvailable()) return false;

  try {
    const cached = localStorage.getItem(key);
    if (!cached) return false;

    const cacheEntry = JSON.parse(cached);
    return cacheEntry.expiresAt > Date.now();
  } catch (error) {
    return false;
  }
};

/**
 * Update cache metadata
 * @param {string} key - Cache key
 * @param {Object} metadata - Metadata to store
 */
const updateCacheMetadata = (key, metadata) => {
  try {
    const existingMetadata = getCache(CACHE_KEYS.METADATA) || {};
    existingMetadata[key] = {
      ...existingMetadata[key],
      ...metadata,
    };
    setCache(CACHE_KEYS.METADATA, existingMetadata, { source: 'system' });
  } catch (error) {
    console.warn('⚠️ Failed to update cache metadata:', error);
  }
};

/**
 * Get cache metadata
 * @returns {Object} Cache metadata
 */
export const getCacheMetadata = () => {
  return getCache(CACHE_KEYS.METADATA) || {};
};

/**
 * Store API data with automatic fallback chain
 * @param {*} data - API data to store
 * @param {string} source - Data source ('api', 'csv', 'fallback')
 */
export const storeApiData = (data, source = 'api') => {
  return setCache(CACHE_KEYS.API_DATA, data, {
    source,
    maxAge: DATA_CONFIG.cache.maxAge
  });
};

/**
 * Get API data from cache
 * @returns {*} Cached API data
 */
export const getApiData = () => {
  return getCache(CACHE_KEYS.API_DATA);
};

/**
 * Store district-specific data
 * @param {string} districtCode - District code
 * @param {*} data - District data
 * @param {string} source - Data source
 */
export const storeDistrictData = (districtCode, data, source = 'api') => {
  const key = `${CACHE_KEYS.DISTRICT_DATA}-${districtCode}`;
  return setCache(key, data, { source });
};

/**
 * Get district-specific data
 * @param {string} districtCode - District code
 * @returns {*} Cached district data
 */
export const getDistrictData = (districtCode) => {
  const key = `${CACHE_KEYS.DISTRICT_DATA}-${districtCode}`;
  return getCache(key);
};

/**
 * Store user preferences
 * @param {Object} preferences - User preferences
 */
export const storeUserPreferences = (preferences) => {
  return setCache(CACHE_KEYS.USER_PREFERENCES, preferences, {
    source: 'user',
    maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
  });
};

/**
 * Get user preferences
 * @returns {Object} User preferences
 */
export const getUserPreferences = () => {
  return getCache(CACHE_KEYS.USER_PREFERENCES) || {
    autoRefresh: false,
    refreshInterval: DATA_CONFIG.refreshIntervals.metrics,
    theme: 'light',
    notifications: false,
    autoLocationDetection: true,
  };
};

/**
 * Store offline queue for failed requests
 * @param {Array} queue - Array of failed requests
 */
export const storeOfflineQueue = (queue) => {
  return setCache(CACHE_KEYS.OFFLINE_QUEUE, queue, {
    source: 'system',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
  });
};

/**
 * Get offline queue
 * @returns {Array} Array of queued requests
 */
export const getOfflineQueue = () => {
  return getCache(CACHE_KEYS.OFFLINE_QUEUE) || [];
};

/**
 * Add request to offline queue
 * @param {Object} request - Request details
 */
export const addToOfflineQueue = (request) => {
  const queue = getOfflineQueue();
  queue.push({
    ...request,
    queuedAt: Date.now(),
    retryCount: 0,
  });
  storeOfflineQueue(queue);
};

/**
 * Process offline queue when back online
 * @param {Function} requestHandler - Function to process requests
 */
export const processOfflineQueue = async (requestHandler) => {
  const queue = getOfflineQueue();
  if (queue.length === 0) return;

  console.log(`🔄 Processing ${queue.length} queued offline requests`);

  const processedRequests = [];
  const failedRequests = [];

  for (const request of queue) {
    try {
      await requestHandler(request);
      processedRequests.push(request);
    } catch (error) {
      request.retryCount = (request.retryCount || 0) + 1;
      if (request.retryCount < 3) {
        failedRequests.push(request);
      } else {
        console.error('❌ Request failed after 3 retries:', request);
      }
    }
  }

  // Update queue with only failed requests
  storeOfflineQueue(failedRequests);

  console.log(`✅ Processed ${processedRequests.length} offline requests`);
  if (failedRequests.length > 0) {
    console.log(`⚠️ ${failedRequests.length} requests still in queue`);
  }
};

/**
 * Update last sync timestamp
 */
export const updateLastSync = () => {
  setCache(CACHE_KEYS.LAST_SYNC, Date.now(), {
    source: 'system',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};

/**
 * Get last sync timestamp
 * @returns {number} Last sync timestamp
 */
export const getLastSync = () => {
  return getCache(CACHE_KEYS.LAST_SYNC) || 0;
};

/**
 * Get cache status and statistics
 * @returns {Object} Cache status information
 */
export const getCacheStatus = () => {
  const usage = getStorageUsage();
  const metadata = getCacheMetadata();
  const lastSync = getLastSync();

  return {
    available: isStorageAvailable(),
    usage: {
      bytes: usage,
      mb: Math.round(usage / (1024 * 1024) * 100) / 100,
      percentage: Math.round((usage / STORAGE_QUOTA.MAX_SIZE) * 100),
    },
    entries: Object.keys(metadata).length,
    lastSync: lastSync ? new Date(lastSync) : null,
    quota: {
      max: STORAGE_QUOTA.MAX_SIZE,
      cleanup: STORAGE_QUOTA.CLEANUP_THRESHOLD,
      remaining: Math.max(0, STORAGE_QUOTA.MAX_SIZE - usage),
    },
  };
};

/**
 * Clear all cache data
 * @param {boolean} keepUserPrefs - Whether to keep user preferences
 */
export const clearCache = (keepUserPrefs = true) => {
  if (!isStorageAvailable()) return;

  const userPrefs = keepUserPrefs ? getUserPreferences() : null;

  // Remove all mgnrega- prefixed keys
  const keysToRemove = [];
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key) && key.startsWith('mgnrega-')) {
      keysToRemove.push(key);
    }
  }

  keysToRemove.forEach(key => localStorage.removeItem(key));

  // Restore user preferences if requested
  if (userPrefs && keepUserPrefs) {
    storeUserPreferences(userPrefs);
  }

  console.log(`🗑️ Cleared ${keysToRemove.length} cache entries`);
};

/**
 * Export cache data for backup/debugging
 * @returns {Object} All cache data
 */
export const exportCacheData = () => {
  if (!isStorageAvailable()) return {};

  const exportData = {};
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key) && key.startsWith('mgnrega-')) {
      try {
        exportData[key] = JSON.parse(localStorage[key]);
      } catch (e) {
        exportData[key] = localStorage[key];
      }
    }
  }

  return exportData;
};

/**
 * Import cache data from backup
 * @param {Object} data - Cache data to import
 * @param {boolean} merge - Whether to merge with existing data
 */
export const importCacheData = (data, merge = false) => {
  if (!isStorageAvailable() || !data) return;

  if (!merge) {
    clearCache(false);
  }

  Object.entries(data).forEach(([key, value]) => {
    try {
      const serialized = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, serialized);
    } catch (error) {
      console.error(`❌ Failed to import cache entry ${key}:`, error);
    }
  });

  console.log(`📥 Imported ${Object.keys(data).length} cache entries`);
};

// Initialize cleanup on module load
if (typeof window !== 'undefined' && isStorageAvailable()) {
  // Clean up expired entries on startup
  setTimeout(() => {
    cleanupExpiredCache();

    // Set up periodic cleanup (every 5 minutes)
    setInterval(cleanupExpiredCache, 5 * 60 * 1000);
  }, 1000);
}

// Export utility object for easier imports
export const offlineStorage = {
  isAvailable: isStorageAvailable,
  getUsage: getStorageUsage,
  cleanup: cleanupExpiredCache,

  // Basic cache operations
  set: setCache,
  get: getCache,
  isValid: isCacheValid,

  // Specialized storage
  storeApiData,
  getApiData,
  storeDistrictData,
  getDistrictData,
  storeUserPreferences,
  getUserPreferences,

  // Offline queue
  addToOfflineQueue,
  getOfflineQueue,
  processOfflineQueue,

  // Sync management
  updateLastSync,
  getLastSync,

  // Status and management
  getStatus: getCacheStatus,
  clear: clearCache,
  export: exportCacheData,
  import: importCacheData,
};

export default offlineStorage;
