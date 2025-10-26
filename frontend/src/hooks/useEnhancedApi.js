import { useState, useEffect, useCallback, useRef } from 'react';
import { enhancedApiClient } from '../utils/enhancedApi';
import { geolocationService } from '../utils/geolocation';
import { offlineStorage } from '../utils/offlineStorage';
import { DATA_CONFIG, ERROR_MESSAGES } from '../utils/constants';

/**
 * Enhanced API hook with auto-detection and offline capabilities
 */
export const useEnhancedApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [networkStatus, setNetworkStatus] = useState(navigator.onLine);
  const abortControllerRef = useRef(null);

  // Track network status
  useEffect(() => {
    const handleOnline = () => setNetworkStatus(true);
    const handleOffline = () => setNetworkStatus(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  /**
   * Execute API call with enhanced error handling
   */
  const executeCall = useCallback(async (apiCall, options = {}) => {
    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    const { showLoading = true, retryOnError = true } = options;

    try {
      if (showLoading) setLoading(true);
      setError(null);

      const result = await apiCall();
      setData(result);
      return result;
    } catch (err) {
      console.error('API call failed:', err);

      const enhancedError = {
        message: err.userFriendly ? err.message : ERROR_MESSAGES.generic,
        original: err,
        recoverable: err.recoverable !== false,
        timestamp: new Date().toISOString(),
      };

      setError(enhancedError);

      if (retryOnError && enhancedError.recoverable) {
        // Could implement retry logic here
      }

      throw enhancedError;
    } finally {
      if (showLoading) setLoading(false);
      abortControllerRef.current = null;
    }
  }, []);

  /**
   * Clear current state
   */
  const clearState = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    loading,
    error,
    data,
    networkStatus,
    executeCall,
    clearState,
  };
};

/**
 * Hook for health checks with auto-retry
 */
export const useHealthCheck = (options = {}) => {
  const [health, setHealth] = useState(null);
  const [checking, setChecking] = useState(false);
  const { autoCheck = true, interval = DATA_CONFIG.refreshIntervals.health } = options;

  const checkHealth = useCallback(async () => {
    setChecking(true);
    try {
      const result = await enhancedApiClient.getHealth();
      setHealth(result.data);
      return result;
    } catch (error) {
      console.warn('Health check failed:', error);
      setHealth({ status: 'error', error: error.message });
      return { success: false, error };
    } finally {
      setChecking(false);
    }
  }, []);

  // Auto-check on mount and interval
  useEffect(() => {
    if (autoCheck) {
      checkHealth();

      if (interval > 0) {
        const timer = setInterval(checkHealth, interval);
        return () => clearInterval(timer);
      }
    }
  }, [autoCheck, interval, checkHealth]);

  return {
    health,
    checking,
    check: checkHealth,
  };
};

/**
 * Hook for fetching all MGNREGA data
 */
export const useAllData = (options = {}) => {
  const { loading, error, data, executeCall } = useEnhancedApi();
  const { autoFetch = true, refreshInterval = 0 } = options;

  const fetchData = useCallback((opts = {}) => {
    return executeCall(() => enhancedApiClient.getAllData(opts), opts);
  }, [executeCall]);

  const refreshData = useCallback(() => {
    return fetchData({ forceRefresh: true });
  }, [fetchData]);

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch, fetchData]);

  // Auto-refresh interval
  useEffect(() => {
    if (refreshInterval > 0) {
      const timer = setInterval(refreshData, refreshInterval);
      return () => clearInterval(timer);
    }
  }, [refreshInterval, refreshData]);

  return {
    data: data?.data,
    source: data?.source,
    count: data?.count,
    timestamp: data?.timestamp,
    loading,
    error,
    fetchData,
    refreshData,
  };
};

/**
 * Hook for district-related operations
 */
export const useDistricts = () => {
  const { loading, error, data, executeCall } = useEnhancedApi();

  const fetchDistricts = useCallback(() => {
    return executeCall(() => enhancedApiClient.getDistricts());
  }, [executeCall]);

  // Auto-fetch on mount
  useEffect(() => {
    fetchDistricts();
  }, [fetchDistricts]);

  return {
    districts: data?.data || [],
    loading,
    error,
    refresh: fetchDistricts,
  };
};

/**
 * Hook for district-specific data with auto-detection
 */
export const useDistrictData = (initialDistrict = null, options = {}) => {
  const { loading, error, data, executeCall } = useEnhancedApi();
  const [selectedDistrict, setSelectedDistrict] = useState(initialDistrict);
  const [autoDetectionEnabled, setAutoDetectionEnabled] = useState(
    options.enableAutoDetection !== false
  );

  const fetchDistrictData = useCallback((districtCode, opts = {}) => {
    return executeCall(() =>
      enhancedApiClient.getDistrictData(districtCode, opts)
    );
  }, [executeCall]);

  const autoDetectAndFetch = useCallback(async () => {
    if (!autoDetectionEnabled) return;

    try {
      const result = await fetchDistrictData(null, { autoDetect: true });
      if (result.district) {
        setSelectedDistrict(result.district);
      }
      return result;
    } catch (error) {
      console.warn('Auto-detection failed:', error);
      // Try cached district
      const cachedDistrict = geolocationService.getCachedDistrict();
      if (cachedDistrict) {
        setSelectedDistrict(cachedDistrict.code);
        return fetchDistrictData(cachedDistrict.code);
      }
      throw error;
    }
  }, [autoDetectionEnabled, fetchDistrictData]);

  const selectDistrict = useCallback((district) => {
    const districtCode = typeof district === 'string' ? district : district?.code;
    setSelectedDistrict(districtCode);
    if (districtCode) {
      return fetchDistrictData(districtCode);
    }
  }, [fetchDistrictData]);

  // Auto-detect on mount if no district selected
  useEffect(() => {
    if (!selectedDistrict && autoDetectionEnabled) {
      autoDetectAndFetch().catch(console.warn);
    } else if (selectedDistrict) {
      fetchDistrictData(selectedDistrict).catch(console.warn);
    }
  }, [selectedDistrict, autoDetectionEnabled, autoDetectAndFetch, fetchDistrictData]);

  return {
    data: data?.data,
    district: data?.district || selectedDistrict,
    source: data?.source,
    loading,
    error,
    autoDetected: data?.autoDetected,
    cached: data?.cached,
    selectDistrict,
    autoDetectAndFetch,
    setAutoDetectionEnabled,
    refresh: () => selectedDistrict && fetchDistrictData(selectedDistrict, { forceRefresh: true }),
  };
};

/**
 * Hook for location-aware operations
 */
export const useLocationAware = () => {
  const [location, setLocation] = useState(null);
  const [detectedDistrict, setDetectedDistrict] = useState(null);
  const [detecting, setDetecting] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState('unknown');

  const detectLocation = useCallback(async (options = {}) => {
    if (!geolocationService.isSupported()) {
      throw new Error('Geolocation not supported');
    }

    setDetecting(true);
    try {
      const result = await geolocationService.detectUserLocationAndDistrict(options);
      setLocation(result.location);
      setDetectedDistrict(result.district);
      return result;
    } catch (error) {
      // Try cached data
      const cachedLocation = geolocationService.getCachedLocation();
      const cachedDistrict = geolocationService.getCachedDistrict();

      if (cachedLocation && cachedDistrict) {
        setLocation(cachedLocation);
        setDetectedDistrict(cachedDistrict);
        return { location: cachedLocation, district: cachedDistrict, cached: true };
      }

      throw error;
    } finally {
      setDetecting(false);
    }
  }, []);

  const checkPermission = useCallback(async () => {
    const status = await geolocationService.checkPermission();
    setPermissionStatus(status);
    return status;
  }, []);

  const requestPermission = useCallback(async () => {
    const granted = await geolocationService.requestPermission();
    setPermissionStatus(granted ? 'granted' : 'denied');
    return granted;
  }, []);

  // Check permission on mount
  useEffect(() => {
    checkPermission();

    // Load cached data
    const cachedLocation = geolocationService.getCachedLocation();
    const cachedDistrict = geolocationService.getCachedDistrict();

    if (cachedLocation) setLocation(cachedLocation);
    if (cachedDistrict) setDetectedDistrict(cachedDistrict);
  }, [checkPermission]);

  return {
    location,
    detectedDistrict,
    detecting,
    permissionStatus,
    isSupported: geolocationService.isSupported(),
    detectLocation,
    checkPermission,
    requestPermission,
    clearCache: geolocationService.clearLocationCache,
  };
};

/**
 * Hook for cache management
 */
export const useCacheManager = () => {
  const [cacheStatus, setCacheStatus] = useState(null);

  const updateStatus = useCallback(() => {
    const status = enhancedApiClient.getCacheStatus();
    setCacheStatus(status);
  }, []);

  const clearCache = useCallback((keepUserPrefs = true) => {
    enhancedApiClient.clearCache(keepUserPrefs);
    updateStatus();
  }, [updateStatus]);

  const exportCache = useCallback(() => {
    return offlineStorage.export();
  }, []);

  const importCache = useCallback((data, merge = false) => {
    offlineStorage.import(data, merge);
    updateStatus();
  }, [updateStatus]);

  // Update status on mount and periodically
  useEffect(() => {
    updateStatus();
    const timer = setInterval(updateStatus, 30000); // Every 30 seconds
    return () => clearInterval(timer);
  }, [updateStatus]);

  return {
    cacheStatus,
    clearCache,
    exportCache,
    importCache,
    refresh: updateStatus,
  };
};

/**
 * Comprehensive hook combining all functionality
 */
export const useEnhancedMGNREGA = (options = {}) => {
  const {
    enableAutoDetection = true,
    autoRefresh = false,
    refreshInterval = DATA_CONFIG.refreshIntervals.metrics,
  } = options;

  // Individual hooks
  const health = useHealthCheck({ autoCheck: true });
  const allData = useAllData({
    autoFetch: true,
    refreshInterval: autoRefresh ? refreshInterval : 0,
  });
  const districts = useDistricts();
  const districtData = useDistrictData(null, { enableAutoDetection });
  const location = useLocationAware();
  const cache = useCacheManager();

  // Global refresh function
  const refreshAll = useCallback(async () => {
    const results = await Promise.allSettled([
      health.check(),
      allData.refreshData(),
      districts.refresh(),
      districtData.refresh(),
    ]);

    return results.map((result, index) => ({
      success: result.status === 'fulfilled',
      data: result.status === 'fulfilled' ? result.value : null,
      error: result.status === 'rejected' ? result.reason : null,
    }));
  }, [health.check, allData.refreshData, districts.refresh, districtData.refresh]);

  // Get overall loading state
  const loading = allData.loading || districts.loading || districtData.loading;

  // Get combined error state
  const error = allData.error || districts.error || districtData.error;

  return {
    // Data
    allData: allData.data,
    districts: districts.districts,
    districtData: districtData.data,
    selectedDistrict: districtData.district,

    // Status
    loading,
    error,
    health: health.health,
    location: location.location,
    detectedDistrict: location.detectedDistrict,
    cacheStatus: cache.cacheStatus,

    // Actions
    selectDistrict: districtData.selectDistrict,
    detectLocation: location.detectLocation,
    refreshAll,

    // Individual refresh functions
    refreshData: allData.refreshData,
    refreshDistricts: districts.refresh,
    refreshDistrictData: districtData.refresh,

    // Cache management
    clearCache: cache.clearCache,
    exportCache: cache.exportCache,

    // Location management
    requestLocationPermission: location.requestPermission,
    clearLocationCache: location.clearCache,

    // Configuration
    setAutoDetectionEnabled: districtData.setAutoDetectionEnabled,
  };
};

export default useEnhancedMGNREGA;
