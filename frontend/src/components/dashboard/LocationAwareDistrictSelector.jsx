import React, { useState, useEffect, useCallback } from 'react';
import { MapPinIcon, GlobeAltIcon, ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { geolocationService } from '../../utils/geolocation';
import { offlineStorage } from '../../utils/offlineStorage';
import { DISTRICTS, ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../utils/constants';

/**
 * Location-aware district selector with auto-detection capabilities
 */
export const LocationAwareDistrictSelector = ({
  selectedDistrict,
  onDistrictChange,
  disabled = false,
  className = '',
  showLocationButton = true,
  autoDetectOnMount = false,
}) => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionStatus, setDetectionStatus] = useState(null);
  const [detectedLocation, setDetectedLocation] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState('unknown');
  const [lastDetectionTime, setLastDetectionTime] = useState(null);

  // Available districts
  const districts = Object.values(DISTRICTS);

  /**
   * Check location permission status on mount
   */
  useEffect(() => {
    const checkPermission = async () => {
      if (!geolocationService.isSupported()) {
        setPermissionStatus('unsupported');
        return;
      }

      try {
        const status = await geolocationService.checkPermission();
        setPermissionStatus(status);
      } catch (error) {
        console.warn('Failed to check location permission:', error);
        setPermissionStatus('unknown');
      }
    };

    checkPermission();

    // Load cached location data if available
    const cachedLocation = geolocationService.getCachedLocation();
    const cachedDistrict = geolocationService.getCachedDistrict();

    if (cachedLocation && cachedDistrict) {
      setDetectedLocation({
        location: cachedLocation,
        district: cachedDistrict,
        cached: true,
      });
      setLastDetectionTime(cachedLocation.timestamp);
      setDetectionStatus('success');
    }
  }, []);

  /**
   * Auto-detect location on mount if enabled
   */
  useEffect(() => {
    if (autoDetectOnMount && permissionStatus === 'granted' && !selectedDistrict) {
      handleAutoDetect();
    }
  }, [autoDetectOnMount, permissionStatus, selectedDistrict]);

  /**
   * Handle auto-detection of location and district
   */
  const handleAutoDetect = useCallback(async () => {
    if (!geolocationService.isSupported()) {
      setDetectionStatus('error');
      return;
    }

    setIsDetecting(true);
    setDetectionStatus(null);

    try {
      // Check if we need to request permission
      if (permissionStatus === 'prompt') {
        const granted = await geolocationService.requestPermission();
        if (!granted) {
          setDetectionStatus('denied');
          return;
        }
        setPermissionStatus('granted');
      }

      // Detect location and district
      const result = await geolocationService.detectUserLocationAndDistrict({
        timeout: 15000,
        enableHighAccuracy: true,
      });

      setDetectedLocation(result);
      setLastDetectionTime(Date.now());

      if (result.district) {
        setDetectionStatus('success');

        // Auto-select detected district
        onDistrictChange(result.district);

        // Store user preference for auto-detection
        const userPrefs = offlineStorage.getUserPreferences();
        offlineStorage.storeUserPreferences({
          ...userPrefs,
          lastAutoDetectedDistrict: result.district,
          autoDetectionEnabled: true,
        });

        console.log(`🎯 Auto-detected and selected: ${result.district.displayName}`);
      } else {
        setDetectionStatus('outside_goa');
      }
    } catch (error) {
      console.error('Location detection failed:', error);
      setDetectionStatus('error');

      // Try to use cached location as fallback
      const cachedDistrict = geolocationService.getCachedDistrict();
      if (cachedDistrict) {
        setDetectionStatus('fallback');
        setDetectedLocation({ district: cachedDistrict, cached: true });
        onDistrictChange(cachedDistrict);
      }
    } finally {
      setIsDetecting(false);
    }
  }, [permissionStatus, onDistrictChange]);

  /**
   * Handle manual district selection
   */
  const handleDistrictSelect = useCallback((districtCode) => {
    const district = districts.find(d => d.code === districtCode);
    if (district) {
      onDistrictChange(district);

      // Clear detection status when manually selecting
      if (detectionStatus === 'success') {
        setDetectionStatus('manual_override');
      }
    }
  }, [districts, onDistrictChange, detectionStatus]);

  /**
   * Get status icon and color based on detection state
   */
  const getStatusInfo = () => {
    switch (detectionStatus) {
      case 'success':
        return {
          icon: CheckCircleIcon,
          color: 'text-green-500',
          bgColor: 'bg-green-50',
          message: 'Location detected successfully',
        };
      case 'error':
        return {
          icon: ExclamationTriangleIcon,
          color: 'text-red-500',
          bgColor: 'bg-red-50',
          message: 'Location detection failed',
        };
      case 'denied':
        return {
          icon: ExclamationTriangleIcon,
          color: 'text-orange-500',
          bgColor: 'bg-orange-50',
          message: 'Location access denied',
        };
      case 'outside_goa':
        return {
          icon: ExclamationTriangleIcon,
          color: 'text-orange-500',
          bgColor: 'bg-orange-50',
          message: 'Location detected outside Goa',
        };
      case 'fallback':
        return {
          icon: CheckCircleIcon,
          color: 'text-blue-500',
          bgColor: 'bg-blue-50',
          message: 'Using cached location',
        };
      case 'manual_override':
        return {
          icon: CheckCircleIcon,
          color: 'text-gray-500',
          bgColor: 'bg-gray-50',
          message: 'Manually selected',
        };
      default:
        return null;
    }
  };

  /**
   * Format location accuracy for display
   */
  const formatAccuracy = (accuracy) => {
    if (!accuracy) return 'Unknown';
    if (accuracy <= 10) return 'Very High';
    if (accuracy <= 50) return 'High';
    if (accuracy <= 100) return 'Medium';
    return 'Low';
  };

  /**
   * Check if auto-detect should be available
   */
  const canAutoDetect = geolocationService.isSupported() &&
                       permissionStatus !== 'unsupported' &&
                       permissionStatus !== 'denied';

  const statusInfo = getStatusInfo();

  return (
    <div className={`space-y-4 ${className}`}>
      {/* District Selector */}
      <div className="space-y-2">
        <label htmlFor="district-select" className="block text-sm font-medium text-gray-700">
          Select District
        </label>

        <div className="relative">
          <select
            id="district-select"
            value={selectedDistrict?.code || ''}
            onChange={(e) => handleDistrictSelect(e.target.value)}
            disabled={disabled || isDetecting}
            className={`
              block w-full rounded-lg border-gray-300 py-3 pl-3 pr-10 text-base
              focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500
              disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500
              ${isDetecting ? 'animate-pulse' : ''}
            `}
            aria-label="Select your district"
          >
            <option value="">Choose your district...</option>
            {districts.map((district) => (
              <option key={district.code} value={district.code}>
                {district.displayName}
              </option>
            ))}
          </select>

          {/* Loading indicator */}
          {isDetecting && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-500"></div>
            </div>
          )}
        </div>
      </div>

      {/* Auto-Detection Section */}
      {showLocationButton && canAutoDetect && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Auto-detect location</span>
            <button
              type="button"
              onClick={handleAutoDetect}
              disabled={disabled || isDetecting}
              className={`
                inline-flex items-center px-3 py-2 border border-transparent text-sm
                leading-4 font-medium rounded-md shadow-sm text-white
                ${isDetecting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                }
                disabled:cursor-not-allowed disabled:opacity-50
                transition-colors duration-200
              `}
              aria-label="Auto-detect your district using location"
            >
              {isDetecting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Detecting...
                </>
              ) : (
                <>
                  <MapPinIcon className="h-4 w-4 mr-2" />
                  Detect Location
                </>
              )}
            </button>
          </div>

          {/* Permission Status */}
          {permissionStatus === 'prompt' && (
            <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded-md">
              📍 Location permission required for auto-detection
            </div>
          )}

          {permissionStatus === 'denied' && (
            <div className="text-xs text-red-600 bg-red-50 p-2 rounded-md">
              ❌ Location access denied. Please enable location services in your browser settings.
            </div>
          )}
        </div>
      )}

      {/* Detection Status */}
      {statusInfo && (
        <div className={`flex items-center space-x-2 p-3 rounded-md ${statusInfo.bgColor}`}>
          <statusInfo.icon className={`h-5 w-5 ${statusInfo.color}`} />
          <div className="flex-1">
            <p className={`text-sm font-medium ${statusInfo.color}`}>
              {statusInfo.message}
            </p>

            {detectedLocation && !detectedLocation.cached && (
              <div className="mt-1 text-xs text-gray-600 space-y-1">
                {detectedLocation.location && (
                  <p>
                    📍 {geolocationService.formatCoordinates(
                      detectedLocation.location.latitude,
                      detectedLocation.location.longitude
                    )}
                    {detectedLocation.location.accuracy && (
                      <span className="ml-2">
                        Accuracy: {formatAccuracy(detectedLocation.location.accuracy)}
                      </span>
                    )}
                  </p>
                )}

                {detectedLocation.district && (
                  <p>
                    🏛️ {detectedLocation.district.displayName}
                    {detectedLocation.district.confidence && (
                      <span className="ml-2 capitalize">
                        ({detectedLocation.district.confidence} confidence)
                      </span>
                    )}
                    {detectedLocation.district.distance && (
                      <span className="ml-2">
                        ~{detectedLocation.district.distance}km from center
                      </span>
                    )}
                  </p>
                )}
              </div>
            )}

            {detectedLocation?.cached && (
              <p className="mt-1 text-xs text-gray-600">
                Using previously detected location
              </p>
            )}
          </div>
        </div>
      )}

      {/* Location Not Supported */}
      {!geolocationService.isSupported() && showLocationButton && (
        <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-md">
          <GlobeAltIcon className="h-5 w-5 text-gray-400" />
          <p className="text-sm text-gray-600">
            Location detection is not supported on this device. Please select your district manually.
          </p>
        </div>
      )}

      {/* Last Detection Time */}
      {lastDetectionTime && detectionStatus === 'success' && (
        <div className="text-xs text-gray-500 text-center">
          Last detected: {new Date(lastDetectionTime).toLocaleString('en-IN')}
        </div>
      )}

      {/* Help Text */}
      <div className="text-xs text-gray-500">
        <p>
          💡 Auto-detection uses your device's location to suggest the appropriate district.
          Your location data is not stored or transmitted to any external servers.
        </p>
      </div>
    </div>
  );
};

export default LocationAwareDistrictSelector;
