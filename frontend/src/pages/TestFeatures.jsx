import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { LocationAwareDistrictSelector } from '../components/dashboard/LocationAwareDistrictSelector';
import { OfflineIndicator } from '../components/common/OfflineIndicator';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useEnhancedMGNREGA, useLocationAware, useCacheManager } from '../hooks/useEnhancedApi';
import { enhancedApiClient } from '../utils/enhancedApi';
import { geolocationService } from '../utils/geolocation';
import { offlineStorage } from '../utils/offlineStorage';
import {
  MapPinIcon,
  CloudIcon,
  WifiIcon,
  SignalSlashIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  TrashIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

/**
 * Test page for demonstrating enhanced features
 */
export const TestFeatures = () => {
  const [testResults, setTestResults] = useState({});
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  // Enhanced hooks
  const {
    allData,
    districts,
    districtData,
    loading,
    error,
    health,
    location,
    detectedDistrict,
    cacheStatus,
    selectDistrict,
    detectLocation,
    refreshAll,
    clearCache,
  } = useEnhancedMGNREGA({
    enableAutoDetection: true,
    autoRefresh: false,
  });

  const locationAware = useLocationAware();
  const cache = useCacheManager();

  // Network status
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  /**
   * Run comprehensive feature tests
   */
  const runTests = async () => {
    setIsRunningTests(true);
    const results = {};

    try {
      // Test 1: Geolocation Support
      console.log('🧪 Testing geolocation support...');
      results.geolocationSupport = {
        supported: geolocationService.isSupported(),
        status: 'success',
        message: geolocationService.isSupported() ? 'Geolocation is supported' : 'Geolocation not supported',
      };

      // Test 2: Location Permission
      if (geolocationService.isSupported()) {
        console.log('🧪 Testing location permission...');
        try {
          const permission = await geolocationService.checkPermission();
          results.locationPermission = {
            permission,
            status: permission === 'granted' ? 'success' : permission === 'denied' ? 'error' : 'warning',
            message: `Location permission: ${permission}`,
          };
        } catch (error) {
          results.locationPermission = {
            permission: 'error',
            status: 'error',
            message: `Permission check failed: ${error.message}`,
          };
        }
      }

      // Test 3: Location Detection
      if (geolocationService.isSupported()) {
        console.log('🧪 Testing location detection...');
        try {
          const locationResult = await geolocationService.detectUserLocationAndDistrict({
            timeout: 10000,
          });

          results.locationDetection = {
            success: !!locationResult.district,
            status: locationResult.district ? 'success' : 'warning',
            message: locationResult.district
              ? `Detected: ${locationResult.district.displayName}`
              : 'Location detected outside Goa',
            data: locationResult,
          };
        } catch (error) {
          results.locationDetection = {
            success: false,
            status: 'error',
            message: `Location detection failed: ${error.message}`,
            error: error.message,
          };
        }
      }

      // Test 4: Offline Storage
      console.log('🧪 Testing offline storage...');
      const storageAvailable = offlineStorage.isAvailable();
      const storageStatus = offlineStorage.getStatus();

      results.offlineStorage = {
        available: storageAvailable,
        status: storageAvailable ? 'success' : 'error',
        message: storageAvailable ? `Storage available (${storageStatus.entries} entries)` : 'Storage not available',
        usage: storageStatus.usage,
      };

      // Test 5: API Health Check
      console.log('🧪 Testing API health...');
      try {
        const healthResult = await enhancedApiClient.getHealth();
        results.apiHealth = {
          healthy: healthResult.success,
          status: healthResult.success ? 'success' : 'warning',
          message: healthResult.success ? 'API is healthy' : 'API issues detected',
          data: healthResult.data,
        };
      } catch (error) {
        results.apiHealth = {
          healthy: false,
          status: 'error',
          message: `API health check failed: ${error.message}`,
          error: error.message,
        };
      }

      // Test 6: Data Fetching
      console.log('🧪 Testing data fetching...');
      try {
        const dataResult = await enhancedApiClient.getAllData();
        results.dataFetching = {
          success: dataResult.success,
          status: dataResult.success ? 'success' : 'warning',
          message: dataResult.success
            ? `Data fetched (${dataResult.count} records, source: ${dataResult.source})`
            : 'Data fetching issues',
          source: dataResult.source,
          count: dataResult.count,
        };
      } catch (error) {
        results.dataFetching = {
          success: false,
          status: 'error',
          message: `Data fetching failed: ${error.message}`,
          error: error.message,
        };
      }

      // Test 7: Cache Operations
      console.log('🧪 Testing cache operations...');
      try {
        // Store test data
        const testData = { test: 'cache_test', timestamp: Date.now() };
        const cacheStored = offlineStorage.set('test-cache-key', testData);

        // Retrieve test data
        const cachedData = offlineStorage.get('test-cache-key');
        const cacheValid = offlineStorage.isCacheValid('test-cache-key');

        // Clean up test data
        offlineStorage.set('test-cache-key', null);

        results.cacheOperations = {
          success: cacheStored && cachedData && cacheValid,
          status: cacheStored && cachedData && cacheValid ? 'success' : 'error',
          message: cacheStored && cachedData && cacheValid
            ? 'Cache operations working correctly'
            : 'Cache operations failed',
        };
      } catch (error) {
        results.cacheOperations = {
          success: false,
          status: 'error',
          message: `Cache test failed: ${error.message}`,
          error: error.message,
        };
      }

      // Test 8: Coordinate Mapping
      console.log('🧪 Testing coordinate mapping...');
      const testCoordinates = [
        { lat: 15.55, lng: 73.83, expected: 'North Goa' }, // Panaji area
        { lat: 15.25, lng: 74.00, expected: 'South Goa' }, // Margao area
        { lat: 19.0760, lng: 72.8777, expected: null }, // Mumbai (outside Goa)
      ];

      const coordinateResults = testCoordinates.map(coord => {
        const result = geolocationService.mapCoordinatesToDistrict(coord.lat, coord.lng);
        return {
          coordinates: `${coord.lat}, ${coord.lng}`,
          expected: coord.expected,
          detected: result?.displayName || 'Outside Goa',
          correct: coord.expected === (result?.displayName || null),
        };
      });

      const correctMappings = coordinateResults.filter(r => r.correct).length;
      results.coordinateMapping = {
        success: correctMappings === testCoordinates.length,
        status: correctMappings === testCoordinates.length ? 'success' : 'warning',
        message: `${correctMappings}/${testCoordinates.length} coordinate mappings correct`,
        details: coordinateResults,
      };

      setTestResults(results);
      console.log('✅ All tests completed:', results);

    } catch (error) {
      console.error('❌ Test suite failed:', error);
      results.overall = {
        success: false,
        status: 'error',
        message: `Test suite failed: ${error.message}`,
        error: error.message,
      };
      setTestResults(results);
    } finally {
      setIsRunningTests(false);
    }
  };

  /**
   * Get status icon for test result
   */
  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <CloudIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  /**
   * Format test result for display
   */
  const formatTestResult = (key, result) => (
    <div key={key} className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg">
      {getStatusIcon(result.status)}
      <div className="flex-1">
        <h4 className="text-sm font-medium text-gray-900 capitalize">
          {key.replace(/([A-Z])/g, ' $1').trim()}
        </h4>
        <p className="text-sm text-gray-600 mt-1">{result.message}</p>

        {result.details && (
          <div className="mt-2 text-xs text-gray-500">
            {Array.isArray(result.details) ? (
              <ul className="list-disc list-inside space-y-1">
                {result.details.map((detail, index) => (
                  <li key={index}>
                    {typeof detail === 'object'
                      ? JSON.stringify(detail, null, 2)
                      : detail}
                  </li>
                ))}
              </ul>
            ) : (
              <pre className="whitespace-pre-wrap">{JSON.stringify(result.details, null, 2)}</pre>
            )}
          </div>
        )}

        {result.data && (
          <details className="mt-2">
            <summary className="text-xs text-blue-600 cursor-pointer">View data</summary>
            <pre className="mt-1 text-xs text-gray-500 whitespace-pre-wrap bg-gray-50 p-2 rounded">
              {JSON.stringify(result.data, null, 2)}
            </pre>
          </details>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Offline Indicator */}
      <OfflineIndicator position="top-right" showDetails={true} />

      <div className="container mx-auto px-4 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Enhanced Features Test Suite
          </h1>
          <p className="text-lg text-gray-600">
            Test auto-detection, offline storage, and enhanced API features
          </p>

          <div className="flex items-center justify-center space-x-4">
            <div className={`flex items-center space-x-1 px-3 py-1 rounded-full ${
              isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {isOnline ? (
                <WifiIcon className="h-4 w-4" />
              ) : (
                <SignalSlashIcon className="h-4 w-4" />
              )}
              <span className="text-sm font-medium">
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>

            <Button
              onClick={runTests}
              disabled={isRunningTests}
              className="flex items-center space-x-2"
            >
              {isRunningTests ? (
                <LoadingSpinner size="sm" />
              ) : (
                <ArrowPathIcon className="h-4 w-4" />
              )}
              <span>{isRunningTests ? 'Running Tests...' : 'Run All Tests'}</span>
            </Button>
          </div>
        </div>

        {/* Test Results */}
        {Object.keys(testResults).length > 0 && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Test Results</h2>
            <div className="space-y-4">
              {Object.entries(testResults).map(([key, result]) =>
                formatTestResult(key, result)
              )}
            </div>
          </Card>
        )}

        {/* Interactive Tests */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Location Detection Test */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Location Detection
            </h3>

            <LocationAwareDistrictSelector
              selectedDistrict={selectedDistrict}
              onDistrictChange={setSelectedDistrict}
              autoDetectOnMount={false}
              showLocationButton={true}
            />

            {selectedDistrict && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium text-green-800">
                    Selected: {selectedDistrict.displayName}
                  </span>
                </div>
              </div>
            )}
          </Card>

          {/* Cache Management */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Cache Management
            </h3>

            <div className="space-y-3">
              <div className="text-sm text-gray-600 space-y-1">
                <div>Available: {cacheStatus?.available ? 'Yes' : 'No'}</div>
                <div>Entries: {cacheStatus?.entries || 0}</div>
                <div>Usage: {cacheStatus?.usage?.mb || 0}MB</div>
                <div>
                  Last Sync: {cacheStatus?.lastSync?.toLocaleString('en-IN') || 'Never'}
                </div>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => cache.refresh()}
                  className="flex items-center space-x-1"
                >
                  <ArrowPathIcon className="h-4 w-4" />
                  <span>Refresh</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => cache.clearCache()}
                  className="flex items-center space-x-1 text-red-600 border-red-300 hover:bg-red-50"
                >
                  <TrashIcon className="h-4 w-4" />
                  <span>Clear</span>
                </Button>
              </div>
            </div>
          </Card>

          {/* API Status */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              API Status
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Health:</span>
                <span className={`text-sm font-medium ${
                  health?.status === 'healthy' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {health?.status || 'Unknown'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Data Available:</span>
                <span className={`text-sm font-medium ${
                  allData ? 'text-green-600' : 'text-red-600'
                }`}>
                  {allData ? 'Yes' : 'No'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Districts:</span>
                <span className="text-sm font-medium text-gray-900">
                  {districts?.length || 0}
                </span>
              </div>

              {error && (
                <div className="p-2 bg-red-50 text-red-700 text-xs rounded">
                  Error: {error.message}
                </div>
              )}
            </div>
          </Card>

          {/* Feature Support */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Feature Support
            </h3>

            <div className="space-y-2 text-sm">
              {[
                { name: 'Geolocation API', supported: 'geolocation' in navigator },
                { name: 'Local Storage', supported: offlineStorage.isAvailable() },
                { name: 'Network Status', supported: 'onLine' in navigator },
                { name: 'Permissions API', supported: 'permissions' in navigator },
                { name: 'Service Worker', supported: 'serviceWorker' in navigator },
              ].map(feature => (
                <div key={feature.name} className="flex items-center justify-between">
                  <span className="text-gray-600">{feature.name}:</span>
                  <div className="flex items-center space-x-1">
                    {feature.supported ? (
                      <>
                        <CheckCircleIcon className="h-4 w-4 text-green-500" />
                        <span className="text-green-600 font-medium">Supported</span>
                      </>
                    ) : (
                      <>
                        <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />
                        <span className="text-red-600 font-medium">Not Supported</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="p-6 bg-blue-50">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">
            Testing Instructions
          </h3>
          <div className="text-sm text-blue-800 space-y-2">
            <p>
              <strong>1. Run All Tests:</strong> Click the "Run All Tests" button to execute comprehensive feature tests.
            </p>
            <p>
              <strong>2. Location Detection:</strong> Use the district selector to test auto-detection functionality.
            </p>
            <p>
              <strong>3. Offline Testing:</strong> Disconnect from internet and test offline functionality.
            </p>
            <p>
              <strong>4. Cache Testing:</strong> Check cache status and clear cache to test fallback behavior.
            </p>
            <p>
              <strong>5. Network Simulation:</strong> Use browser dev tools to simulate slow network conditions.
            </p>
          </div>
        </Card>

        {/* Debug Information */}
        {process.env.NODE_ENV === 'development' && (
          <Card className="p-6 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Debug Information
            </h3>
            <details>
              <summary className="cursor-pointer text-sm font-medium text-gray-700">
                View Full State
              </summary>
              <pre className="mt-2 text-xs text-gray-600 whitespace-pre-wrap">
                {JSON.stringify({
                  allData: !!allData,
                  districts: districts?.length,
                  districtData: !!districtData,
                  selectedDistrict: selectedDistrict?.code,
                  loading,
                  error: error?.message,
                  health: health?.status,
                  location: !!location,
                  detectedDistrict: detectedDistrict?.code,
                  cacheStatus: cacheStatus?.entries,
                  isOnline,
                }, null, 2)}
              </pre>
            </details>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TestFeatures;
