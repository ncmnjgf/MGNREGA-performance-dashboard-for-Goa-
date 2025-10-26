import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";

// Simple cache
const cache = new Map();

// Basic API client
const api = axios.create({
  baseURL: "http://localhost:5000",
  timeout: 10000,
});

/**
 * Simple useApi hook without complex features
 */
export const useApi = (apiFunction, options = {}) => {
  const { immediate = false, cacheKey = null } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const abortControllerRef = useRef(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check cache
      if (cacheKey && cache.has(cacheKey)) {
        const cached = cache.get(cacheKey);
        if (Date.now() - cached.timestamp < 60000) { // 1 minute cache
          setData(cached.data);
          setLoading(false);
          return cached.data;
        }
      }

      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      const result = await apiFunction({
        signal: abortControllerRef.current.signal
      });

      setData(result);

      // Cache result
      if (cacheKey) {
        cache.set(cacheKey, {
          data: result,
          timestamp: Date.now()
        });
      }

      return result;
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message);
        console.error('API Error:', err);
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction, cacheKey]);

  const refetch = useCallback(() => {
    return fetchData();
  }, [fetchData]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  // Initial fetch
  useEffect(() => {
    if (immediate) {
      fetchData().catch(() => {
        // Error already handled in fetchData
      });
    }
  }, [immediate, fetchData]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    data,
    loading,
    error,
    refetch,
    reset
  };
};

/**
 * Hook for fetching all data
 */
export const useAllData = () => {
  const fetchAllData = useCallback(async () => {
    const response = await api.get("/api");
    return response.data;
  }, []);

  return useApi(fetchAllData, {
    immediate: true,
    cacheKey: "allData"
  });
};

/**
 * Hook for health check
 */
export const useHealthCheck = () => {
  const [health, setHealth] = useState(null);

  const checkHealth = useCallback(async () => {
    try {
      const response = await api.get("/health", { timeout: 5000 });
      const healthData = { status: "healthy", data: response.data };
      setHealth(healthData);
      return healthData;
    } catch (error) {
      const healthData = { status: "unhealthy", error: error.message };
      setHealth(healthData);
      return healthData;
    }
  }, []);

  return {
    health,
    check: checkHealth
  };
};

/**
 * Hook for district data
 */
export const useDistrictData = (districtCode) => {
  const fetchDistrictData = useCallback(async () => {
    if (!districtCode) return null;
    const response = await api.get(`/api/data?district=${districtCode}`);
    return response.data;
  }, [districtCode]);

  return useApi(fetchDistrictData, {
    immediate: !!districtCode,
    cacheKey: districtCode ? `district-${districtCode}` : null
  });
};

export default useApi;
