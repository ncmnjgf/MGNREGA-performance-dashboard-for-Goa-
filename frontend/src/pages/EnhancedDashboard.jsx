import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  MapPinIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  CloudIcon,
  WifiIcon,
  SignalSlashIcon,
  CogIcon
} from '@heroicons/react/24/outline';

// Enhanced components
import { LocationAwareDistrictSelector } from '../components/dashboard/LocationAwareDistrictSelector';
import { OfflineIndicator, SimpleOfflineIndicator } from '../components/common/OfflineIndicator';
import { MetricCard, MetricsGrid } from '../components/dashboard/MetricCard';
import { TrendChart } from '../components/dashboard/TrendChart';
import { ComparisonChart } from '../components/dashboard/ComparisonChart';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import {
  LoadingSpinner,
  LoadingOverlay,
  LoadingError,
  EmptyState,
  MetricCardSkeleton,
  ChartSkeleton,
} from '../components/common/LoadingStates';

// Enhanced hooks and utilities
import { useEnhancedMGNREGA, useLocationAware, useCacheManager } from '../hooks/useEnhancedApi';
import { enhancedApiClient } from '../utils/enhancedApi';
import { offlineStorage } from '../utils/offlineStorage';
import { geolocationService } from '../utils/geolocation';
import { METRICS, DISTRICTS, ERROR_MESSAGES, SUCCESS_MESSAGES } from '../utils/constants';

/**
 * Enhanced Dashboard with auto-detection, offline support, and improved UX
 */
export const EnhancedDashboard = () => {
  // Local state
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(5 * 60 * 1000); // 5 minutes
  const [showComparison, setShowComparison] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState(new Date());

  // Enhanced MGNREGA hook with all functionality
  const {
    allData,
    districts,
    districtData,
    selectedDistrict,
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
    setAutoDetectionEnabled,
  } = useEnhancedMGNREGA({
    enableAutoDetection: true,
    autoRefresh: autoRefreshEnabled,
    refreshInterval,
  });

  // Location-aware hook for additional location features
  const locationAware = useLocationAware();

  // Cache management
  const cache = useCacheManager();

  // Network status
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Track network status
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

  // Auto-refresh timer
  useEffect(() => {
    if (!autoRefreshEnabled || !isOnline) return;

    const timer = setInterval(async () => {
      console.log('🔄 Auto-refreshing dashboard data...');
      try {
        await refreshAll();
        setLastRefreshTime(new Date());
      } catch (error) {
        console.error('Auto-refresh failed:', error);
      }
    }, refreshInterval);

    return () => clearInterval(timer);
  }, [autoRefreshEnabled, isOnline, refreshInterval, refreshAll]);

  // Process metrics data
  const processedMetrics = useMemo(() => {
    if (!districtData) return null;

    const data = Array.isArray(districtData) ? districtData : [districtData];
    const latest = data[data.length - 1] || {};

    return {
      personDays: {
        value: latest.person_days || 0,
        change: calculateChange(data, 'person_days'),
        trend: getTrend(data, 'person_days'),
      },
      households: {
        value: latest.households || 0,
        change: calculateChange(data, 'households'),
        trend: getTrend(data, 'households'),
      },
      fundsSpent: {
        value: latest.funds_spent || 0,
        change: calculateChange(data, 'funds_spent'),
        trend: getTrend(data, 'funds_spent'),
      },
      completionRate: {
        value: latest.completion_rate || 0,
        change: calculateChange(data, 'completion_rate'),
        trend: getTrend(data, 'completion_rate'),
      },
    };
  }, [districtData]);

  // Chart data processing
  const chartData = useMemo(() => {
    if (!districtData || !Array.isArray(districtData)) return [];

    return districtData
      .map(item => ({
        date: item.date,
        month: getMonthName(item.month),
        year: item.year,
        personDays: item.person_days || 0,
        households: item.households || 0,
        fundsSpent: item.funds_spent || 0,
        completionRate: item.completion_rate || 0,
      }))
      .slice(-12); // Last 12 months
  }, [districtData]);

  // Handle manual refresh
  const handleRefresh = useCallback(async () => {
    try {
      console.log('🔄 Manual refresh initiated...');
      const results = await refreshAll();
      setLastRefreshTime(new Date());

      const successCount = results.filter(r => r.success).length;
      if (successCount > 0) {
        console.log(`✅ ${successCount} data sources refreshed successfully`);
      }
    } catch (error) {
      console.error('❌ Manual refresh failed:', error);
    }
  }, [refreshAll]);

  // Handle district change
  const handleDistrictChange = useCallback((district) => {
    console.log(`📍 District changed to: ${district?.displayName || 'None'}`);
    selectDistrict(district);
  }, [selectDistrict]);

  // Handle location detection
  const handleLocationDetection = useCallback(async () => {
    try {
      console.log('🌍 Starting location detection...');
      const result = await detectLocation();
      if (result.district) {
        console.log(`✅ Location detected: ${result.district.displayName}`);
      }
    } catch (error) {
      console.error('❌ Location detection failed:', error);
    }
  }, [detectLocation]);

  // Handle auto-refresh toggle
  const handleAutoRefreshToggle = useCallback(() => {
    const newValue = !autoRefreshEnabled;
    setAutoRefreshEnabled(newValue);

    // Store preference
    const userPrefs = offlineStorage.getUserPreferences();
    offlineStorage.storeUserPreferences({
      ...userPrefs,
      autoRefresh: newValue,
      refreshInterval,
    });

    console.log(`🔄 Auto-refresh ${newValue ? 'enabled' : 'disabled'}`);
  }, [autoRefreshEnabled, refreshInterval]);

  // Handle cache clear
  const handleClearCache = useCallback(() => {
    clearCache(true); // Keep user preferences
    console.log('🗑️ Cache cleared');
  }, [clearCache]);

  // Get data source indicator
  const getDataSourceInfo = () => {
    if (!districtData) return null;

    if (error && cacheStatus?.entries > 0) {
      return {
        icon: CloudIcon,
        text: 'Cached Data',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
      };
    }

    if (!isOnline) {
      return {
        icon: SignalSlashIcon,
        text: 'Offline Mode',
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
      };
    }

    return {
      icon: WifiIcon,
      text: 'Live Data',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    };
  };

  const dataSourceInfo = getDataSourceInfo();

  // Loading state for initial load
  if (loading && !districtData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-lg font-medium text-gray-700">
              Loading MGNREGA Dashboard...
            </p>
            <p className="mt-2 text-sm text-gray-500">
              {location.detecting ? 'Detecting your location...' : 'Fetching employment data...'}
            </p>
          </div>

          <div className="space-y-6">
            {/* Skeleton loaders */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <MetricCardSkeleton key={i} />
              ))}
            </div>
            <ChartSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Offline Indicator */}
      <OfflineIndicator showDetails={true} position="top-right" />

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Title and Status */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">
                MGNREGA Goa Dashboard
              </h1>

              <div className="flex items-center space-x-4 text-sm">
                {/* Data Source Indicator */}
                {dataSourceInfo && (
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-full ${dataSourceInfo.bgColor}`}>
                    <dataSourceInfo.icon className={`h-4 w-4 ${dataSourceInfo.color}`} />
                    <span className={`font-medium ${dataSourceInfo.color}`}>
                      {dataSourceInfo.text}
                    </span>
                  </div>
                )}

                {/* Selected District */}
                {selectedDistrict && (
                  <div className="flex items-center space-x-1 text-gray-600">
                    <MapPinIcon className="h-4 w-4" />
                    <span>{selectedDistrict.displayName || selectedDistrict.name}</span>
                  </div>
                )}

                {/* Last Refresh */}
                <div className="text-gray-500">
                  Updated: {lastRefreshTime.toLocaleTimeString('en-IN')}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-3">
              {/* Auto-refresh Toggle */}
              <label className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  checked={autoRefreshEnabled}
                  onChange={handleAutoRefreshToggle}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-gray-700">Auto-refresh</span>
              </label>

              {/* Manual Refresh */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center space-x-1"
              >
                <ArrowPathIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </Button>

              {/* Settings Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
                className="flex items-center space-x-1"
              >
                <CogIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Cache Information */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-900">Cache Status</h3>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div>Entries: {cacheStatus?.entries || 0}</div>
                    <div>Usage: {cacheStatus?.usage?.mb || 0}MB</div>
                    <div>Last sync: {cacheStatus?.lastSync?.toLocaleString('en-IN') || 'Never'}</div>
                  </div>
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={handleClearCache}
                    className="text-xs"
                  >
                    Clear Cache
                  </Button>
                </div>

                {/* Location Settings */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-900">Location</h3>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div>Status: {locationAware.permissionStatus}</div>
                    {locationAware.location && (
                      <div>
                        Coordinates: {geolocationService.formatCoordinates(
                          locationAware.location.latitude,
                          locationAware.location.longitude
                        )}
                      </div>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={handleLocationDetection}
                    disabled={locationAware.detecting}
                    className="text-xs"
                  >
                    {locationAware.detecting ? 'Detecting...' : 'Detect Location'}
                  </Button>
                </div>

                {/* Network Status */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-900">Network</h3>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div className="flex items-center space-x-1">
                      {isOnline ? (
                        <>
                          <WifiIcon className="h-3 w-3 text-green-500" />
                          <span>Online</span>
                        </>
                      ) : (
                        <>
                          <SignalSlashIcon className="h-3 w-3 text-red-500" />
                          <span>Offline</span>
                        </>
                      )}
                    </div>
                    <div>Health: {health?.status || 'Unknown'}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* District Selector */}
        <Card className="p-6">
          <LocationAwareDistrictSelector
            selectedDistrict={selectedDistrict}
            onDistrictChange={handleDistrictChange}
            autoDetectOnMount={true}
            showLocationButton={true}
            className="max-w-md"
          />

          {/* Location Detection Status */}
          {locationAware.detecting && (
            <div className="mt-4 flex items-center space-x-2 text-sm text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span>Detecting your location...</span>
            </div>
          )}
        </Card>

        {/* Error State */}
        {error && !districtData && (
          <Card className="p-6">
            <LoadingError
              error={error}
              onRetry={handleRefresh}
              showDetails={true}
            />
          </Card>
        )}

        {/* Main Content */}
        {processedMetrics && (
          <>
            {/* Metrics Grid */}
            <MetricsGrid>
              <MetricCard
                title={METRICS.PERSON_DAYS.title}
                value={processedMetrics.personDays.value}
                unit={METRICS.PERSON_DAYS.unit}
                icon={METRICS.PERSON_DAYS.icon}
                change={processedMetrics.personDays.change}
                trend={processedMetrics.personDays.trend}
                color="primary"
                format="number"
                loading={loading}
              />
              <MetricCard
                title={METRICS.HOUSEHOLDS.title}
                value={processedMetrics.households.value}
                unit={METRICS.HOUSEHOLDS.unit}
                icon={METRICS.HOUSEHOLDS.icon}
                change={processedMetrics.households.change}
                trend={processedMetrics.households.trend}
                color="secondary"
                format="number"
                loading={loading}
              />
              <MetricCard
                title={METRICS.FUNDS_SPENT.title}
                value={processedMetrics.fundsSpent.value}
                unit={METRICS.FUNDS_SPENT.unit}
                icon={METRICS.FUNDS_SPENT.icon}
                change={processedMetrics.fundsSpent.change}
                trend={processedMetrics.fundsSpent.trend}
                color="accent"
                format="currency"
                loading={loading}
              />
              <MetricCard
                title={METRICS.COMPLETION_RATE.title}
                value={processedMetrics.completionRate.value}
                unit={METRICS.COMPLETION_RATE.unit}
                icon={METRICS.COMPLETION_RATE.icon}
                change={processedMetrics.completionRate.change}
                trend={processedMetrics.completionRate.trend}
                color="success"
                format="percentage"
                loading={loading}
              />
            </MetricsGrid>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Trend Chart */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Monthly Trends
                  </h2>
                  <SimpleOfflineIndicator />
                </div>

                {chartData.length > 0 ? (
                  <TrendChart
                    data={chartData}
                    metrics={['personDays', 'households', 'fundsSpent']}
                    height={300}
                    loading={loading}
                  />
                ) : (
                  <ChartSkeleton />
                )}
              </Card>

              {/* Comparison Chart */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    District Comparison
                  </h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowComparison(!showComparison)}
                  >
                    {showComparison ? 'Hide' : 'Show'} Comparison
                  </Button>
                </div>

                {showComparison && chartData.length > 0 ? (
                  <ComparisonChart
                    data={allData || []}
                    districts={districts}
                    selectedDistrict={selectedDistrict?.code}
                    height={300}
                    loading={loading}
                  />
                ) : (
                  <EmptyState
                    title="District Comparison"
                    description="Click 'Show Comparison' to compare districts"
                    icon="📊"
                  />
                )}
              </Card>
            </div>
          </>
        )}

        {/* Empty State */}
        {!loading && !districtData && !error && (
          <Card className="p-12">
            <EmptyState
              title="No Data Available"
              description="Please select a district to view MGNREGA employment data"
              icon="📊"
              action={
                <Button onClick={handleLocationDetection} disabled={locationAware.detecting}>
                  <MapPinIcon className="h-4 w-4 mr-2" />
                  {locationAware.detecting ? 'Detecting...' : 'Auto-detect Location'}
                </Button>
              }
            />
          </Card>
        )}

        {/* Footer Info */}
        <div className="text-center text-sm text-gray-500 space-y-1">
          <p>
            MGNREGA Goa Dashboard - Real-time employment generation data
          </p>
          <p>
            Auto-detection uses device location • Data cached for offline access •
            Last updated: {lastRefreshTime.toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && districtData && (
        <LoadingOverlay message="Updating data..." />
      )}
    </div>
  );
};

// Helper functions
function calculateChange(data, field) {
  if (!data || data.length < 2) return 0;

  const current = data[data.length - 1]?.[field] || 0;
  const previous = data[data.length - 2]?.[field] || 0;

  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

function getTrend(data, field) {
  if (!data || data.length < 3) return 'stable';

  const values = data.slice(-3).map(item => item[field] || 0);
  const isIncreasing = values[2] > values[1] && values[1] > values[0];
  const isDecreasing = values[2] < values[1] && values[1] < values[0];

  if (isIncreasing) return 'up';
  if (isDecreasing) return 'down';
  return 'stable';
}

function getMonthName(month) {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  return months[month - 1] || 'Unknown';
}

export default EnhancedDashboard;
