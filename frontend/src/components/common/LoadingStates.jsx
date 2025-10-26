import React from 'react';
import { clsx } from 'clsx';
import { Icon } from '../ui/Icon';

/**
 * Enhanced loading spinner with different sizes and variants
 */
export const LoadingSpinner = ({
  size = 'md',
  className = '',
  text = '',
  variant = 'default',
  ...props
}) => {
  const sizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const variants = {
    default: 'border-gray-300 border-t-primary-600',
    primary: 'border-primary-200 border-t-primary-600',
    white: 'border-gray-100 border-t-white',
  };

  return (
    <div className="flex flex-col items-center gap-3" {...props}>
      <div
        className={clsx(
          'animate-spin rounded-full border-2',
          sizes[size],
          variants[variant],
          className
        )}
        role="status"
        aria-label={text || 'Loading'}
      />
      {text && (
        <p className="text-sm text-gray-600 text-center animate-pulse">
          {text}
        </p>
      )}
      <span className="sr-only">{text || 'Loading content, please wait...'}</span>
    </div>
  );
};

/**
 * Skeleton loading placeholder for text content
 */
export const SkeletonText = ({
  lines = 1,
  className = '',
  width = 'full',
  height = 'auto',
  animate = true
}) => {
  const widths = {
    full: 'w-full',
    '3/4': 'w-3/4',
    '1/2': 'w-1/2',
    '1/3': 'w-1/3',
    '1/4': 'w-1/4',
  };

  const heights = {
    auto: 'h-4',
    sm: 'h-3',
    md: 'h-4',
    lg: 'h-5',
    xl: 'h-6',
  };

  return (
    <div className={clsx('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={clsx(
            'bg-gray-200 rounded',
            widths[width] || width,
            heights[height] || height,
            animate && 'animate-pulse',
            // Last line is often shorter
            index === lines - 1 && lines > 1 && 'w-3/4'
          )}
          aria-hidden="true"
        />
      ))}
    </div>
  );
};

/**
 * Skeleton loading placeholder for metric cards
 */
export const MetricCardSkeleton = ({ className = '' }) => (
  <div className={clsx('bg-white rounded-xl border border-gray-100 p-6 animate-pulse', className)}>
    <div className="flex items-center gap-3 mb-4">
      <div className="w-8 h-8 bg-gray-200 rounded-lg" />
      <div className="h-6 bg-gray-200 rounded w-24" />
    </div>
    <div className="space-y-3">
      <div className="h-10 bg-gray-200 rounded w-20" />
      <div className="h-4 bg-gray-200 rounded w-16" />
      <div className="h-4 bg-gray-200 rounded w-20" />
    </div>
  </div>
);

/**
 * Skeleton loading placeholder for charts
 */
export const ChartSkeleton = ({ height = 300, className = '' }) => (
  <div className={clsx('bg-white rounded-xl border border-gray-100 p-6 animate-pulse', className)}>
    <div className="flex items-center gap-2 mb-6">
      <div className="w-5 h-5 bg-gray-200 rounded" />
      <div className="h-6 bg-gray-200 rounded w-32" />
    </div>
    <div
      className="bg-gray-200 rounded-lg relative overflow-hidden"
      style={{ height }}
    >
      {/* Animated shimmer effect */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* Mock chart elements */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="w-2 bg-gray-300 rounded-full opacity-50" style={{ height: `${20 + Math.random() * 60}%` }} />
        ))}
      </div>
    </div>
  </div>
);

/**
 * Skeleton loading for district selector
 */
export const DistrictSelectorSkeleton = ({ className = '' }) => (
  <div className={clsx('bg-white rounded-xl border border-gray-100 p-6 animate-pulse', className)}>
    <div className="flex items-center gap-2 mb-4">
      <div className="w-4 h-4 bg-gray-200 rounded" />
      <div className="h-5 bg-gray-200 rounded w-32" />
    </div>
    <div className="flex gap-3">
      <div className="flex-1 h-12 bg-gray-200 rounded-lg" />
      <div className="h-12 w-32 bg-gray-200 rounded-lg" />
    </div>
  </div>
);

/**
 * Loading overlay for entire sections
 */
export const LoadingOverlay = ({
  children,
  loading = false,
  text = 'Loading...',
  className = '',
  spinnerSize = 'lg',
  blur = true
}) => {
  if (!loading) return children;

  return (
    <div className={clsx('relative', className)}>
      {children && (
        <div className={clsx('opacity-50', blur && 'blur-sm')}>
          {children}
        </div>
      )}
      <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        <LoadingSpinner size={spinnerSize} text={text} />
      </div>
    </div>
  );
};

/**
 * Progressive loading component that shows different states
 */
export const ProgressiveLoader = ({
  stage = 0,
  stages = [],
  className = ''
}) => {
  const defaultStages = [
    { text: 'Connecting to server...', icon: 'wifi' },
    { text: 'Fetching district data...', icon: 'map-pin' },
    { text: 'Processing information...', icon: 'activity' },
    { text: 'Almost ready...', icon: 'check-circle' },
  ];

  const currentStages = stages.length > 0 ? stages : defaultStages;
  const currentStage = currentStages[Math.min(stage, currentStages.length - 1)];

  return (
    <div className={clsx('flex flex-col items-center gap-6 py-8', className)}>
      <div className="relative">
        <LoadingSpinner size="lg" variant="primary" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon
            name={currentStage?.icon || 'activity'}
            className="text-primary-600 animate-pulse"
            size="md"
          />
        </div>
      </div>

      <div className="text-center">
        <p className="text-lg font-medium text-gray-900 mb-2">
          {currentStage?.text || 'Loading...'}
        </p>

        {/* Progress bar */}
        <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-600 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${Math.min(((stage + 1) / currentStages.length) * 100, 100)}%` }}
          />
        </div>

        <p className="text-sm text-gray-600 mt-2">
          Step {Math.min(stage + 1, currentStages.length)} of {currentStages.length}
        </p>
      </div>
    </div>
  );
};

/**
 * Retry component for failed loading states
 */
export const LoadingError = ({
  error,
  onRetry,
  retrying = false,
  className = '',
  showDetails = false
}) => {
  return (
    <div className={clsx('text-center py-8', className)}>
      <div className="mb-4">
        <div className="w-16 h-16 mx-auto mb-4 bg-error-100 rounded-full flex items-center justify-center">
          <Icon name="alert-triangle" size="lg" className="text-error-600" />
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Failed to Load Data
        </h3>

        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          {error || 'Unable to fetch the requested information. Please check your connection and try again.'}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={onRetry}
          disabled={retrying}
          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {retrying ? (
            <>
              <LoadingSpinner size="sm" variant="white" className="mr-2" />
              Retrying...
            </>
          ) : (
            <>
              <Icon name="refresh" size="sm" className="mr-2" />
              Try Again
            </>
          )}
        </button>

        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          <Icon name="refresh" size="sm" className="mr-2" />
          Reload Page
        </button>
      </div>

      {showDetails && error && (
        <details className="mt-6 text-left max-w-lg mx-auto">
          <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
            Technical Details
          </summary>
          <div className="mt-2 p-4 bg-gray-50 rounded-lg text-sm font-mono text-gray-700 overflow-auto">
            {error.toString()}
          </div>
        </details>
      )}
    </div>
  );
};

/**
 * Empty state component for when no data is available
 */
export const EmptyState = ({
  icon = 'inbox',
  title = 'No Data Available',
  description = 'There is no data to display at this time.',
  action = null,
  className = ''
}) => {
  return (
    <div className={clsx('text-center py-12', className)}>
      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
        <Icon name={icon} size="lg" className="text-gray-400" />
      </div>

      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {title}
      </h3>

      <p className="text-gray-500 mb-6 max-w-sm mx-auto">
        {description}
      </p>

      {action && (
        <div className="flex justify-center">
          {action}
        </div>
      )}
    </div>
  );
};

/**
 * Data quality indicator for loaded content
 */
export const DataQualityIndicator = ({
  quality = 'medium',
  lastUpdated,
  source = 'api',
  className = ''
}) => {
  const qualityConfig = {
    high: {
      color: 'text-success-600',
      bg: 'bg-success-50',
      label: 'High Quality',
      icon: 'check-circle'
    },
    medium: {
      color: 'text-warning-600',
      bg: 'bg-warning-50',
      label: 'Medium Quality',
      icon: 'alert-triangle'
    },
    low: {
      color: 'text-error-600',
      bg: 'bg-error-50',
      label: 'Limited Data',
      icon: 'x-circle'
    }
  };

  const config = qualityConfig[quality] || qualityConfig.medium;

  const formatLastUpdated = (date) => {
    if (!date) return 'Unknown';
    const now = new Date();
    const updated = new Date(date);
    const diffMs = now - updated;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    return updated.toLocaleDateString();
  };

  return (
    <div className={clsx('inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs', config.bg, className)}>
      <Icon name={config.icon} size="xs" className={config.color} />
      <span className={config.color}>{config.label}</span>
      {lastUpdated && (
        <>
          <span className="text-gray-400">•</span>
          <span className="text-gray-600">
            {formatLastUpdated(lastUpdated)}
          </span>
        </>
      )}
      {source !== 'api' && (
        <>
          <span className="text-gray-400">•</span>
          <span className="text-gray-600 capitalize">
            {source}
          </span>
        </>
      )}
    </div>
  );
};

export default {
  LoadingSpinner,
  SkeletonText,
  MetricCardSkeleton,
  ChartSkeleton,
  DistrictSelectorSkeleton,
  LoadingOverlay,
  ProgressiveLoader,
  LoadingError,
  EmptyState,
  DataQualityIndicator,
};
