import React, { useState, useEffect } from 'react';
import {
  WifiIcon,
  SignalSlashIcon,
  CloudIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { offlineStorage } from '../../utils/offlineStorage';

/**
 * Offline status indicator with cache information and network status
 */
export const OfflineIndicator = ({
  showDetails = true,
  className = '',
  position = 'top-right' // top-right, top-left, bottom-right, bottom-left
}) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [cacheStatus, setCacheStatus] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [lastSync, setLastSync] = useState(null);

  // Update network status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      console.log('🌐 Back online');
    };

    const handleOffline = () => {
      setIsOnline(false);
      console.log('📱 Gone offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Update cache status periodically
  useEffect(() => {
    const updateCacheStatus = () => {
      const status = offlineStorage.getStatus();
      setCacheStatus(status);
      setLastSync(status.lastSync);
    };

    // Initial load
    updateCacheStatus();

    // Update every 30 seconds
    const interval = setInterval(updateCacheStatus, 30000);

    return () => clearInterval(interval);
  }, []);

  /**
   * Get indicator icon and color based on status
   */
  const getStatusInfo = () => {
    if (isOnline) {
      return {
        icon: WifiIcon,
        color: 'text-green-500',
        bgColor: 'bg-green-100',
        status: 'online',
        message: 'Online - Data is up to date',
      };
    } else if (cacheStatus?.available && cacheStatus.entries > 0) {
      return {
        icon: CloudIcon,
        color: 'text-blue-500',
        bgColor: 'bg-blue-100',
        status: 'offline-cached',
        message: 'Offline - Using cached data',
      };
    } else {
      return {
        icon: SignalSlashIcon,
        color: 'text-red-500',
        bgColor: 'bg-red-100',
        status: 'offline-no-cache',
        message: 'Offline - Limited functionality',
      };
    }
  };

  /**
   * Format cache usage for display
   */
  const formatCacheUsage = () => {
    if (!cacheStatus?.available) return 'Not available';

    const { usage } = cacheStatus;
    return `${usage.mb}MB (${usage.percentage}%)`;
  };

  /**
   * Format last sync time
   */
  const formatLastSync = () => {
    if (!lastSync) return 'Never';

    const now = Date.now();
    const diff = now - lastSync.getTime();

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  /**
   * Get position classes
   */
  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4';
      case 'top-right':
        return 'top-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      default:
        return 'top-4 right-4';
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  return (
    <div className={`fixed z-50 ${getPositionClasses()} ${className}`}>
      <div
        className="relative"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {/* Status Indicator */}
        <div className={`
          flex items-center space-x-2 px-3 py-2 rounded-lg shadow-md border
          ${statusInfo.bgColor} border-gray-200 backdrop-blur-sm
          transition-all duration-200 hover:shadow-lg
        `}>
          <StatusIcon className={`h-4 w-4 ${statusInfo.color}`} />

          {showDetails && (
            <div className="flex items-center space-x-2">
              <span className={`text-xs font-medium ${statusInfo.color}`}>
                {isOnline ? 'Online' : 'Offline'}
              </span>

              {!isOnline && cacheStatus?.entries > 0 && (
                <span className="text-xs text-gray-600">
                  ({cacheStatus.entries} cached)
                </span>
              )}
            </div>
          )}
        </div>

        {/* Detailed Tooltip */}
        {showTooltip && (
          <div className={`
            absolute ${position.includes('right') ? 'right-0' : 'left-0'}
            ${position.includes('top') ? 'top-full mt-2' : 'bottom-full mb-2'}
            w-64 bg-white rounded-lg shadow-xl border border-gray-200 p-3 z-60
            transition-all duration-200 transform
          `}>
            {/* Status Header */}
            <div className="flex items-center space-x-2 mb-3 pb-2 border-b border-gray-100">
              <StatusIcon className={`h-5 w-5 ${statusInfo.color}`} />
              <div>
                <p className={`text-sm font-semibold ${statusInfo.color}`}>
                  Network Status
                </p>
                <p className="text-xs text-gray-600">
                  {statusInfo.message}
                </p>
              </div>
            </div>

            {/* Cache Information */}
            {cacheStatus?.available && (
              <div className="space-y-2 mb-3">
                <h4 className="text-xs font-medium text-gray-700 flex items-center">
                  <CloudIcon className="h-3 w-3 mr-1" />
                  Cache Status
                </h4>

                <div className="space-y-1 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Entries:</span>
                    <span className="font-mono">{cacheStatus.entries}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Usage:</span>
                    <span className="font-mono">{formatCacheUsage()}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Last sync:</span>
                    <span className="font-mono">{formatLastSync()}</span>
                  </div>
                </div>

                {/* Cache Usage Bar */}
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      cacheStatus.usage.percentage > 80
                        ? 'bg-red-500'
                        : cacheStatus.usage.percentage > 60
                        ? 'bg-yellow-500'
                        : 'bg-blue-500'
                    }`}
                    style={{ width: `${Math.min(cacheStatus.usage.percentage, 100)}%` }}
                  />
                </div>
              </div>
            )}

            {/* Offline Queue Information */}
            {!isOnline && (
              <div className="space-y-2 mb-3 pt-2 border-t border-gray-100">
                <h4 className="text-xs font-medium text-gray-700 flex items-center">
                  <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
                  Offline Mode
                </h4>

                <div className="text-xs text-gray-600 space-y-1">
                  <div className="flex items-start space-x-1">
                    <CheckCircleIcon className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Cached data available for viewing</span>
                  </div>

                  <div className="flex items-start space-x-1">
                    <InformationCircleIcon className="h-3 w-3 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span>Updates will sync when back online</span>
                  </div>

                  {cacheStatus?.entries === 0 && (
                    <div className="flex items-start space-x-1">
                      <ExclamationTriangleIcon className="h-3 w-3 text-red-500 mt-0.5 flex-shrink-0" />
                      <span>No cached data - limited functionality</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Data Freshness Warning */}
            {!isOnline && lastSync && (Date.now() - lastSync.getTime() > 24 * 60 * 60 * 1000) && (
              <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
                <div className="flex items-start space-x-1">
                  <ExclamationTriangleIcon className="h-3 w-3 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-yellow-700">
                    <p className="font-medium">Data may be outdated</p>
                    <p>Last updated over 24 hours ago</p>
                  </div>
                </div>
              </div>
            )}

            {/* Tips */}
            <div className="pt-2 mt-2 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                💡 {isOnline
                  ? 'Data is automatically synced and cached for offline access'
                  : 'Connect to internet to sync latest data'
                }
              </p>
            </div>
          </div>
        )}

        {/* Pulse animation for offline with cache */}
        {!isOnline && cacheStatus?.entries > 0 && (
          <div className={`
            absolute inset-0 rounded-lg ${statusInfo.bgColor}
            animate-pulse opacity-50 pointer-events-none
          `} />
        )}
      </div>
    </div>
  );
};

/**
 * Simple offline indicator without detailed tooltip
 */
export const SimpleOfflineIndicator = ({ className = '' }) => {
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

  if (isOnline) return null;

  return (
    <div className={`
      inline-flex items-center space-x-1 px-2 py-1 bg-yellow-100
      text-yellow-800 text-xs font-medium rounded-full ${className}
    `}>
      <SignalSlashIcon className="h-3 w-3" />
      <span>Offline</span>
    </div>
  );
};

export default OfflineIndicator;
