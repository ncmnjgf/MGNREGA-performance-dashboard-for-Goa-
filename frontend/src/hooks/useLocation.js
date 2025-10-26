import { useState, useCallback, useRef, useEffect } from 'react';
import { DISTRICTS } from '../utils/constants';

/**
 * Custom hook for geolocation detection and district mapping
 * Provides location detection with fallback options and district mapping
 */
export function useLocation() {
  const [location, setLocation] = useState(null);
  const [detecting, setDetecting] = useState(false);
  const [error, setError] = useState(null);
  const [permission, setPermission] = useState('prompt');
  const [detectedDistrict, setDetectedDistrict] = useState(null);
  const watchIdRef = useRef(null);

  // Check if geolocation is supported
  const isSupported = 'geolocation' in navigator;

  /**
   * Get current position with options
   * @param {Object} options - Geolocation options
   * @returns {Promise<GeolocationPosition>}
   */
  const getCurrentPosition = useCallback((options = {}) => {
    return new Promise((resolve, reject) => {
      if (!isSupported) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      const defaultOptions = {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
        ...options,
      };

      navigator.geolocation.getCurrentPosition(resolve, reject, defaultOptions);
    });
  }, [isSupported]);

  /**
   * Map coordinates to Goa district
   * @param {number} latitude - Latitude coordinate
   * @param {number} longitude - Longitude coordinate
   * @returns {Object|null} Detected district or null
   */
  const mapCoordinatesToDistrict = useCallback((latitude, longitude) => {
    // Goa state boundaries (approximate)
    const goaBounds = {
      north: 15.8,
      south: 14.9,
      east: 74.3,
      west: 73.7,
    };

    // Check if coordinates are within Goa
    if (
      latitude < goaBounds.south ||
      latitude > goaBounds.north ||
      longitude < goaBounds.west ||
      longitude > goaBounds.east
    ) {
      return null; // Outside Goa
    }

    // Simple north-south division based on latitude
    // North Goa: latitude > 15.35
    // South Goa: latitude <= 15.35
    const isNorthGoa = latitude > 15.35;

    return isNorthGoa ? DISTRICTS.NORTH_GOA : DISTRICTS.SOUTH_GOA;
  }, []);

  /**
   * Calculate distance between two coordinates (in kilometers)
   * @param {number} lat1 - First latitude
   * @param {number} lon1 - First longitude
   * @param {number} lat2 - Second latitude
   * @param {number} lon2 - Second longitude
   * @returns {number} Distance in kilometers
   */
  const calculateDistance = useCallback((lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }, []);

  /**
   * Get more accurate district by calculating distance to district centers
   * @param {number} latitude - User latitude
   * @param {number} longitude - User longitude
   * @returns {Object} Best matching district
   */
  const getAccurateDistrict = useCallback((latitude, longitude) => {
    const districts = Object.values(DISTRICTS);
    let closestDistrict = districts[0];
    let minDistance = Infinity;

    districts.forEach(district => {
      const distance = calculateDistance(
        latitude,
        longitude,
        district.coordinates.latitude,
        district.coordinates.longitude
      );

      if (distance < minDistance) {
        minDistance = distance;
        closestDistrict = district;
      }
    });

    return {
      ...closestDistrict,
      distance: minDistance,
      accuracy: minDistance < 20 ? 'high' : minDistance < 50 ? 'medium' : 'low',
    };
  }, [calculateDistance]);

  /**
   * Detect user's location and map to district
   * @param {Object} options - Detection options
   */
  const detectLocation = useCallback(async (options = {}) => {
    if (!isSupported) {
      setError('Location detection is not supported on this device');
      return;
    }

    setDetecting(true);
    setError(null);

    try {
      const position = await getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000, // 1 minute
        ...options,
      });

      const { latitude, longitude, accuracy } = position.coords;

      setLocation({
        latitude,
        longitude,
        accuracy,
        timestamp: position.timestamp,
      });

      // Map to district
      const mappedDistrict = mapCoordinatesToDistrict(latitude, longitude);

      if (mappedDistrict) {
        const accurateDistrict = getAccurateDistrict(latitude, longitude);
        setDetectedDistrict(accurateDistrict);
      } else {
        setDetectedDistrict(null);
        setError('Location detected outside Goa state');
      }

      setPermission('granted');
    } catch (err) {
      setError(getLocationErrorMessage(err));
      setPermission(err.code === 1 ? 'denied' : 'prompt');
    } finally {
      setDetecting(false);
    }
  }, [isSupported, getCurrentPosition, mapCoordinatesToDistrict, getAccurateDistrict]);

  /**
   * Start watching user's location
   * @param {Object} options - Watch options
   */
  const watchLocation = useCallback((options = {}) => {
    if (!isSupported) {
      setError('Location watching is not supported on this device');
      return;
    }

    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }

    const defaultOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 30000, // 30 seconds
      ...options,
    };

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;

        setLocation({
          latitude,
          longitude,
          accuracy,
          timestamp: position.timestamp,
        });

        const mappedDistrict = mapCoordinatesToDistrict(latitude, longitude);
        if (mappedDistrict) {
          const accurateDistrict = getAccurateDistrict(latitude, longitude);
          setDetectedDistrict(accurateDistrict);
        }

        setError(null);
      },
      (err) => {
        setError(getLocationErrorMessage(err));
      },
      defaultOptions
    );
  }, [isSupported, mapCoordinatesToDistrict, getAccurateDistrict]);

  /**
   * Stop watching location
   */
  const stopWatching = useCallback(() => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  /**
   * Clear location data
   */
  const clearLocation = useCallback(() => {
    setLocation(null);
    setDetectedDistrict(null);
    setError(null);
    stopWatching();
  }, [stopWatching]);

  /**
   * Request location permission
   */
  const requestPermission = useCallback(async () => {
    if (!isSupported) {
      setError('Location detection is not supported');
      return false;
    }

    try {
      // Check if permissions API is available
      if ('permissions' in navigator) {
        const result = await navigator.permissions.query({ name: 'geolocation' });
        setPermission(result.state);

        if (result.state === 'granted') {
          return true;
        } else if (result.state === 'denied') {
          setError('Location permission has been denied');
          return false;
        }
      }

      // Try to get position to trigger permission prompt
      await detectLocation();
      return true;
    } catch (err) {
      setError(getLocationErrorMessage(err));
      return false;
    }
  }, [isSupported, detectLocation]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopWatching();
    };
  }, [stopWatching]);

  // Check permission status on mount
  useEffect(() => {
    if (isSupported && 'permissions' in navigator) {
      navigator.permissions.query({ name: 'geolocation' })
        .then(result => {
          setPermission(result.state);
        })
        .catch(() => {
          // Ignore errors for browsers that don't support permissions query
        });
    }
  }, [isSupported]);

  return {
    // Location data
    location,
    detectedDistrict,

    // Status
    detecting,
    error,
    permission,
    isSupported,

    // Actions
    detectLocation,
    watchLocation,
    stopWatching,
    clearLocation,
    requestPermission,

    // Utilities
    mapCoordinatesToDistrict,
    calculateDistance,
    getAccurateDistrict,
  };
}

/**
 * Get user-friendly error message for location errors
 * @param {GeolocationPositionError} error - Geolocation error
 * @returns {string} User-friendly error message
 */
function getLocationErrorMessage(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return 'Location access was denied. Please enable location services and try again.';
    case error.POSITION_UNAVAILABLE:
      return 'Location information is unavailable. Please check your device settings.';
    case error.TIMEOUT:
      return 'Location request timed out. Please try again.';
    default:
      return 'Unable to detect your location. Please select your district manually.';
  }
}

/**
 * Hook for persisting selected district in localStorage
 */
export function useSelectedDistrict() {
  const [selectedDistrict, setSelectedDistrict] = useState(() => {
    try {
      const stored = localStorage.getItem('mgnrega-selected-district');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const updateSelectedDistrict = useCallback((district) => {
    setSelectedDistrict(district);
    try {
      if (district) {
        localStorage.setItem('mgnrega-selected-district', JSON.stringify(district));
      } else {
        localStorage.removeItem('mgnrega-selected-district');
      }
    } catch (error) {
      console.warn('Failed to save selected district:', error);
    }
  }, []);

  const clearSelectedDistrict = useCallback(() => {
    updateSelectedDistrict(null);
  }, [updateSelectedDistrict]);

  return {
    selectedDistrict,
    setSelectedDistrict: updateSelectedDistrict,
    clearSelectedDistrict,
  };
}

/**
 * Hook that combines location detection with district selection
 */
export function useDistrictSelection() {
  const location = useLocation();
  const { selectedDistrict, setSelectedDistrict } = useSelectedDistrict();

  // Auto-select detected district if none is selected
  useEffect(() => {
    if (location.detectedDistrict && !selectedDistrict) {
      setSelectedDistrict(location.detectedDistrict);
    }
  }, [location.detectedDistrict, selectedDistrict, setSelectedDistrict]);

  const selectDistrict = useCallback((district) => {
    const districtObj = typeof district === 'string'
      ? Object.values(DISTRICTS).find(d => d.name === district || d.code === district)
      : district;

    setSelectedDistrict(districtObj);
  }, [setSelectedDistrict]);

  const detectAndSelect = useCallback(async () => {
    try {
      await location.detectLocation();
      // District will be auto-selected via useEffect above
      return true;
    } catch (error) {
      console.error('Detection failed:', error);
      return false;
    }
  }, [location.detectLocation]);

  return {
    ...location,
    selectedDistrict,
    selectDistrict,
    detectAndSelect,
    clearSelection: () => setSelectedDistrict(null),
  };
}

export default useLocation;
