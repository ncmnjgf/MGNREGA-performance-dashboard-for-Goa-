/**
 * Geolocation Service for MGNREGA Goa Dashboard
 * Provides advanced geolocation features, district auto-detection, and coordinate mapping
 */

import { DISTRICTS, ERROR_MESSAGES, SUCCESS_MESSAGES } from './constants';
import { offlineStorage } from './offlineStorage';

// Goa state boundaries (more precise coordinates)
const GOA_BOUNDARIES = {
  north: 15.8,
  south: 14.89,
  east: 74.31,
  west: 73.7,
};

// District boundary definitions (approximate)
const DISTRICT_BOUNDARIES = {
  [DISTRICTS.NORTH_GOA.code]: {
    north: 15.8,
    south: 15.35,
    east: 74.31,
    west: 73.7,
    center: { lat: 15.55, lng: 73.83 },
    landmarks: [
      { name: 'Panaji', lat: 15.4989, lng: 73.8278 },
      { name: 'Mapusa', lat: 15.5937, lng: 73.8120 },
      { name: 'Ponda', lat: 15.4013, lng: 74.0180 },
    ],
  },
  [DISTRICTS.SOUTH_GOA.code]: {
    north: 15.35,
    south: 14.89,
    east: 74.31,
    west: 73.7,
    center: { lat: 15.25, lng: 74.00 },
    landmarks: [
      { name: 'Margao', lat: 15.2700, lng: 73.9500 },
      { name: 'Vasco da Gama', lat: 15.3993, lng: 73.8157 },
      { name: 'Quepem', lat: 15.2231, lng: 74.0681 },
    ],
  },
};

// Geolocation options for different accuracy levels
const GEO_OPTIONS = {
  high: {
    enableHighAccuracy: true,
    timeout: 15000,
    maximumAge: 60000, // 1 minute
  },
  medium: {
    enableHighAccuracy: false,
    timeout: 10000,
    maximumAge: 300000, // 5 minutes
  },
  low: {
    enableHighAccuracy: false,
    timeout: 5000,
    maximumAge: 600000, // 10 minutes
  },
};

/**
 * Check if geolocation is supported
 * @returns {boolean} True if geolocation is supported
 */
export const isGeolocationSupported = () => {
  return 'geolocation' in navigator;
};

/**
 * Check geolocation permission status
 * @returns {Promise<string>} Permission state ('granted', 'denied', 'prompt')
 */
export const checkGeolocationPermission = async () => {
  if (!isGeolocationSupported()) {
    return 'unsupported';
  }

  try {
    if ('permissions' in navigator) {
      const result = await navigator.permissions.query({ name: 'geolocation' });
      return result.state;
    }
    return 'unknown';
  } catch (error) {
    console.warn('Permission query not supported:', error);
    return 'unknown';
  }
};

/**
 * Request geolocation permission
 * @returns {Promise<boolean>} True if permission granted
 */
export const requestGeolocationPermission = async () => {
  if (!isGeolocationSupported()) {
    throw new Error('Geolocation is not supported on this device');
  }

  try {
    // Try to get position to trigger permission request
    await getCurrentPosition({ timeout: 5000 });
    return true;
  } catch (error) {
    if (error.code === 1) {
      // Permission denied
      return false;
    }
    // Other errors don't necessarily mean permission was denied
    throw error;
  }
};

/**
 * Get current position with enhanced error handling
 * @param {Object} options - Geolocation options
 * @returns {Promise<Position>} Geolocation position
 */
export const getCurrentPosition = (options = {}) => {
  return new Promise((resolve, reject) => {
    if (!isGeolocationSupported()) {
      reject(new Error('Geolocation not supported'));
      return;
    }

    const geoOptions = {
      ...GEO_OPTIONS.medium,
      ...options,
    };

    navigator.geolocation.getCurrentPosition(
      resolve,
      (error) => {
        reject(enhanceGeolocationError(error));
      },
      geoOptions
    );
  });
};

/**
 * Watch position changes
 * @param {Function} callback - Success callback
 * @param {Function} errorCallback - Error callback
 * @param {Object} options - Watch options
 * @returns {number} Watch ID
 */
export const watchPosition = (callback, errorCallback, options = {}) => {
  if (!isGeolocationSupported()) {
    errorCallback(new Error('Geolocation not supported'));
    return null;
  }

  const geoOptions = {
    ...GEO_OPTIONS.high,
    ...options,
  };

  return navigator.geolocation.watchPosition(
    callback,
    (error) => {
      errorCallback(enhanceGeolocationError(error));
    },
    geoOptions
  );
};

/**
 * Clear position watch
 * @param {number} watchId - Watch ID to clear
 */
export const clearWatch = (watchId) => {
  if (watchId && isGeolocationSupported()) {
    navigator.geolocation.clearWatch(watchId);
  }
};

/**
 * Calculate distance between two coordinates (Haversine formula)
 * @param {number} lat1 - First latitude
 * @param {number} lng1 - First longitude
 * @param {number} lat2 - Second latitude
 * @param {number} lng2 - Second longitude
 * @returns {number} Distance in kilometers
 */
export const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
    Math.cos(toRadians(lat2)) *
    Math.sin(dLng / 2) *
    Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Convert degrees to radians
 * @param {number} degrees - Degrees to convert
 * @returns {number} Radians
 */
const toRadians = (degrees) => {
  return degrees * (Math.PI / 180);
};

/**
 * Check if coordinates are within Goa state
 * @param {number} latitude - Latitude coordinate
 * @param {number} longitude - Longitude coordinate
 * @returns {boolean} True if within Goa boundaries
 */
export const isWithinGoa = (latitude, longitude) => {
  return (
    latitude >= GOA_BOUNDARIES.south &&
    latitude <= GOA_BOUNDARIES.north &&
    longitude >= GOA_BOUNDARIES.west &&
    longitude <= GOA_BOUNDARIES.east
  );
};

/**
 * Map coordinates to district using boundary-based detection
 * @param {number} latitude - Latitude coordinate
 * @param {number} longitude - Longitude coordinate
 * @returns {Object|null} District information or null
 */
export const mapCoordinatesToDistrict = (latitude, longitude) => {
  // First check if within Goa
  if (!isWithinGoa(latitude, longitude)) {
    return null;
  }

  // Use the latitude-based division (more accurate than simple center distance)
  if (latitude > 15.35) {
    return {
      ...DISTRICTS.NORTH_GOA,
      confidence: 'high',
      method: 'boundary',
    };
  } else {
    return {
      ...DISTRICTS.SOUTH_GOA,
      confidence: 'high',
      method: 'boundary',
    };
  }
};

/**
 * Get district using distance-based calculation (more accurate)
 * @param {number} latitude - Latitude coordinate
 * @param {number} longitude - Longitude coordinate
 * @returns {Object} District with confidence and distance information
 */
export const getDistrictByDistance = (latitude, longitude) => {
  const districts = Object.values(DISTRICTS);
  let closestDistrict = null;
  let minDistance = Infinity;
  let confidenceLevel = 'low';

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

  // Determine confidence based on distance
  if (minDistance < 10) {
    confidenceLevel = 'high';
  } else if (minDistance < 25) {
    confidenceLevel = 'medium';
  }

  return {
    ...closestDistrict,
    distance: Math.round(minDistance * 100) / 100,
    confidence: confidenceLevel,
    method: 'distance',
  };
};

/**
 * Get district using landmark-based detection
 * @param {number} latitude - Latitude coordinate
 * @param {number} longitude - Longitude coordinate
 * @returns {Object|null} District with landmark information
 */
export const getDistrictByLandmarks = (latitude, longitude) => {
  let closestLandmark = null;
  let closestDistrict = null;
  let minDistance = Infinity;

  Object.entries(DISTRICT_BOUNDARIES).forEach(([districtCode, boundaries]) => {
    boundaries.landmarks.forEach(landmark => {
      const distance = calculateDistance(
        latitude,
        longitude,
        landmark.lat,
        landmark.lng
      );

      if (distance < minDistance) {
        minDistance = distance;
        closestLandmark = landmark;
        closestDistrict = Object.values(DISTRICTS).find(d => d.code === districtCode);
      }
    });
  });

  if (closestLandmark && minDistance < 15) {
    return {
      ...closestDistrict,
      landmark: closestLandmark.name,
      distance: Math.round(minDistance * 100) / 100,
      confidence: minDistance < 5 ? 'high' : minDistance < 10 ? 'medium' : 'low',
      method: 'landmark',
    };
  }

  return null;
};

/**
 * Auto-detect district with multiple methods and confidence scoring
 * @param {number} latitude - Latitude coordinate
 * @param {number} longitude - Longitude coordinate
 * @returns {Object} Best district match with metadata
 */
export const autoDetectDistrict = (latitude, longitude) => {
  // Method 1: Boundary-based detection (most accurate for Goa)
  const boundaryResult = mapCoordinatesToDistrict(latitude, longitude);

  // Method 2: Distance-based detection
  const distanceResult = getDistrictByDistance(latitude, longitude);

  // Method 3: Landmark-based detection
  const landmarkResult = getDistrictByLandmarks(latitude, longitude);

  // Choose best result based on confidence and method reliability
  const results = [boundaryResult, distanceResult, landmarkResult].filter(Boolean);

  if (results.length === 0) {
    return null;
  }

  // Priority: boundary > landmark > distance
  const sortedResults = results.sort((a, b) => {
    const methodScore = {
      boundary: 3,
      landmark: 2,
      distance: 1,
    };

    const confidenceScore = {
      high: 3,
      medium: 2,
      low: 1,
    };

    const aScore = methodScore[a.method] + confidenceScore[a.confidence];
    const bScore = methodScore[b.method] + confidenceScore[b.confidence];

    return bScore - aScore;
  });

  const bestResult = sortedResults[0];

  // Add consensus information if multiple methods agree
  const consensus = results.filter(r => r.code === bestResult.code).length;

  return {
    ...bestResult,
    consensus: consensus > 1,
    alternativeMethods: results.length - 1,
    allResults: results,
  };
};

/**
 * Detect user location and map to district
 * @param {Object} options - Detection options
 * @returns {Promise<Object>} Location and district information
 */
export const detectUserLocationAndDistrict = async (options = {}) => {
  try {
    console.log('🌍 Starting location detection...');

    // Get current position
    const position = await getCurrentPosition({
      ...GEO_OPTIONS.high,
      ...options,
    });

    const { latitude, longitude, accuracy } = position.coords;

    console.log(`📍 Location detected: ${latitude.toFixed(4)}, ${longitude.toFixed(4)} (±${Math.round(accuracy)}m)`);

    // Cache the location for future use
    const locationData = {
      latitude,
      longitude,
      accuracy,
      timestamp: position.timestamp || Date.now(),
    };

    offlineStorage.set('last-location', locationData, {
      source: 'geolocation',
      maxAge: 5 * 60 * 1000, // 5 minutes
    });

    // Auto-detect district
    const districtResult = autoDetectDistrict(latitude, longitude);

    if (!districtResult) {
      console.warn('⚠️ Location detected outside Goa state');
      return {
        location: locationData,
        district: null,
        error: 'Location detected outside Goa state',
        withinGoa: false,
      };
    }

    console.log(`🏛️ District detected: ${districtResult.name} (confidence: ${districtResult.confidence})`);

    // Cache the district detection result
    offlineStorage.set('last-district-detection', districtResult, {
      source: 'geolocation',
      maxAge: 10 * 60 * 1000, // 10 minutes
    });

    return {
      location: locationData,
      district: districtResult,
      withinGoa: true,
      success: true,
    };
  } catch (error) {
    console.error('❌ Location detection failed:', error);

    // Try to use cached location as fallback
    const cachedLocation = offlineStorage.get('last-location');
    const cachedDistrict = offlineStorage.get('last-district-detection');

    if (cachedLocation && cachedDistrict) {
      console.log('📱 Using cached location data as fallback');
      return {
        location: cachedLocation,
        district: cachedDistrict,
        withinGoa: true,
        cached: true,
        error: error.message,
      };
    }

    throw error;
  }
};

/**
 * Get cached location if available
 * @returns {Object|null} Cached location data
 */
export const getCachedLocation = () => {
  return offlineStorage.get('last-location');
};

/**
 * Get cached district detection
 * @returns {Object|null} Cached district data
 */
export const getCachedDistrict = () => {
  return offlineStorage.get('last-district-detection');
};

/**
 * Clear cached location data
 */
export const clearLocationCache = () => {
  offlineStorage.set('last-location', null);
  offlineStorage.set('last-district-detection', null);
  console.log('🗑️ Location cache cleared');
};

/**
 * Enhance geolocation error with user-friendly message
 * @param {GeolocationPositionError} error - Original error
 * @returns {Error} Enhanced error
 */
const enhanceGeolocationError = (error) => {
  const enhancedError = new Error();
  enhancedError.code = error.code;
  enhancedError.originalMessage = error.message;

  switch (error.code) {
    case error.PERMISSION_DENIED:
      enhancedError.message = ERROR_MESSAGES.locationDenied;
      enhancedError.userFriendly = true;
      enhancedError.recoverable = true;
      break;

    case error.POSITION_UNAVAILABLE:
      enhancedError.message = ERROR_MESSAGES.locationUnavailable;
      enhancedError.userFriendly = true;
      enhancedError.recoverable = false;
      break;

    case error.TIMEOUT:
      enhancedError.message = ERROR_MESSAGES.timeout;
      enhancedError.userFriendly = true;
      enhancedError.recoverable = true;
      break;

    default:
      enhancedError.message = 'Unable to determine your location. Please try again.';
      enhancedError.userFriendly = true;
      enhancedError.recoverable = true;
  }

  return enhancedError;
};

/**
 * Format coordinates for display
 * @param {number} latitude - Latitude
 * @param {number} longitude - Longitude
 * @param {number} precision - Decimal places
 * @returns {string} Formatted coordinates
 */
export const formatCoordinates = (latitude, longitude, precision = 4) => {
  return `${latitude.toFixed(precision)}, ${longitude.toFixed(precision)}`;
};

/**
 * Get location accuracy description
 * @param {number} accuracy - Accuracy in meters
 * @returns {string} Human-readable accuracy description
 */
export const getAccuracyDescription = (accuracy) => {
  if (accuracy <= 10) return 'Very High (±10m)';
  if (accuracy <= 50) return 'High (±50m)';
  if (accuracy <= 100) return 'Medium (±100m)';
  if (accuracy <= 500) return 'Low (±500m)';
  return 'Very Low (>500m)';
};

/**
 * Main geolocation service object
 */
export const geolocationService = {
  // Support and permissions
  isSupported: isGeolocationSupported,
  checkPermission: checkGeolocationPermission,
  requestPermission: requestGeolocationPermission,

  // Position operations
  getCurrentPosition,
  watchPosition,
  clearWatch,

  // District detection
  detectUserLocationAndDistrict,
  autoDetectDistrict,
  mapCoordinatesToDistrict,

  // Utilities
  calculateDistance,
  isWithinGoa,
  formatCoordinates,
  getAccuracyDescription,

  // Cache management
  getCachedLocation,
  getCachedDistrict,
  clearLocationCache,

  // Constants
  GOA_BOUNDARIES,
  DISTRICT_BOUNDARIES,
};

export default geolocationService;
