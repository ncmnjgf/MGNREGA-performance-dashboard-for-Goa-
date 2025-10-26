import React, { useState } from 'react';
import {
  TrendingUpIcon,
  TrendingDownIcon,
  MinusIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';

/**
 * Enhanced Metric Card with improved accessibility and mobile-first design
 */
export const EnhancedMetricCard = ({
  title,
  value,
  unit = '',
  icon,
  change = 0,
  trend = 'stable',
  color = 'primary',
  format = 'number',
  loading = false,
  description,
  target,
  status = 'normal',
  onClick,
  className = '',
  size = 'default',
  showTrend = true,
  showIcon = true,
  animated = true,
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Format the value based on type
  const formatValue = (val) => {
    if (loading || val === null || val === undefined) return '---';

    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
          maximumFractionDigits: 0,
        }).format(val);

      case 'percentage':
        return `${val}%`;

      case 'number':
        return new Intl.NumberFormat('en-IN').format(val);

      case 'compact':
        return new Intl.NumberFormat('en-IN', {
          notation: 'compact',
          maximumFractionDigits: 1,
        }).format(val);

      default:
        return val;
    }
  };

  // Get color scheme based on color prop
  const getColorScheme = () => {
    const schemes = {
      primary: {
        bg: 'bg-primary-50',
        text: 'text-primary-700',
        accent: 'text-primary-600',
        icon: 'text-primary-500',
        border: 'border-primary-200',
        hover: 'hover:bg-primary-100',
      },
      secondary: {
        bg: 'bg-secondary-50',
        text: 'text-secondary-700',
        accent: 'text-secondary-600',
        icon: 'text-secondary-500',
        border: 'border-secondary-200',
        hover: 'hover:bg-secondary-100',
      },
      success: {
        bg: 'bg-success-50',
        text: 'text-success-700',
        accent: 'text-success-600',
        icon: 'text-success-500',
        border: 'border-success-200',
        hover: 'hover:bg-success-100',
      },
      warning: {
        bg: 'bg-warning-50',
        text: 'text-warning-700',
        accent: 'text-warning-600',
        icon: 'text-warning-500',
        border: 'border-warning-200',
        hover: 'hover:bg-warning-100',
      },
      error: {
        bg: 'bg-error-50',
        text: 'text-error-700',
        accent: 'text-error-600',
        icon: 'text-error-500',
        border: 'border-error-200',
        hover: 'hover:bg-error-100',
      },
      info: {
        bg: 'bg-info-50',
        text: 'text-info-700',
        accent: 'text-info-600',
        icon: 'text-info-500',
        border: 'border-info-200',
        hover: 'hover:bg-info-100',
      },
    };

    return schemes[color] || schemes.primary;
  };

  // Get trend icon and styling
  const getTrendInfo = () => {
    if (change > 0) {
      return {
        icon: TrendingUpIcon,
        color: 'text-success-600',
        bg: 'bg-success-100',
        text: 'Increase',
        direction: 'up',
      };
    } else if (change < 0) {
      return {
        icon: TrendingDownIcon,
        color: 'text-error-600',
        bg: 'bg-error-100',
        text: 'Decrease',
        direction: 'down',
      };
    } else {
      return {
        icon: MinusIcon,
        color: 'text-gray-500',
        bg: 'bg-gray-100',
        text: 'No change',
        direction: 'stable',
      };
    }
  };

  // Get status indicator
  const getStatusInfo = () => {
    const statuses = {
      success: {
        icon: CheckCircleIcon,
        color: 'text-success-600',
        bg: 'bg-success-100',
      },
      warning: {
        icon: ExclamationCircleIcon,
        color: 'text-warning-600',
        bg: 'bg-warning-100',
      },
      error: {
        icon: ExclamationCircleIcon,
        color: 'text-error-600',
        bg: 'bg-error-100',
      },
      normal: {
        icon: InformationCircleIcon,
        color: 'text-info-600',
        bg: 'bg-info-100',
      },
    };

    return statuses[status] || statuses.normal;
  };

  // Get size classes
  const getSizeClasses = () => {
    const sizes = {
      small: {
        container: 'p-4',
        title: 'text-sm',
        value: 'text-2xl',
        icon: 'w-6 h-6',
        spacing: 'space-y-2',
      },
      default: {
        container: 'p-6',
        title: 'text-base',
        value: 'text-3xl lg:text-4xl',
        icon: 'w-8 h-8',
        spacing: 'space-y-3',
      },
      large: {
        container: 'p-8',
        title: 'text-lg',
        value: 'text-4xl lg:text-5xl',
        icon: 'w-10 h-10',
        spacing: 'space-y-4',
      },
    };

    return sizes[size] || sizes.default;
  };

  const colorScheme = getColorScheme();
  const trendInfo = getTrendInfo();
  const statusInfo = getStatusInfo();
  const sizeClasses = getSizeClasses();

  const cardId = `metric-card-${title.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div
      id={cardId}
      className={`
        relative overflow-hidden
        bg-white rounded-card shadow-card
        border border-gray-100
        transition-all duration-300 ease-out
        ${onClick ? 'cursor-pointer hover:shadow-card-hover hover:-translate-y-1' : ''}
        ${animated ? 'animate-fade-in' : ''}
        ${isHovered ? colorScheme.hover : ''}
        ${className}
      `}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role={onClick ? 'button' : 'region'}
      tabIndex={onClick ? 0 : -1}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      aria-labelledby={`${cardId}-title`}
      aria-describedby={description ? `${cardId}-description` : undefined}
      {...props}
    >
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      )}

      <div className={`${sizeClasses.container} ${sizeClasses.spacing}`}>
        {/* Header with title and optional icon */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3
              id={`${cardId}-title`}
              className={`
                ${sizeClasses.title} font-semibold text-gray-700
                truncate leading-tight
              `}
            >
              {title}
            </h3>

            {description && (
              <p
                id={`${cardId}-description`}
                className="mt-1 text-sm text-gray-500 leading-relaxed"
              >
                {description}
              </p>
            )}
          </div>

          {/* Status/Info Icon */}
          {showIcon && (
            <div className="ml-3 flex-shrink-0">
              {icon ? (
                <div className={`${colorScheme.bg} ${colorScheme.icon} p-2 rounded-lg`}>
                  <span className={`${sizeClasses.icon} block`} role="img" aria-label="Metric icon">
                    {typeof icon === 'string' ? icon : <icon className={sizeClasses.icon} />}
                  </span>
                </div>
              ) : (
                <div className={`${statusInfo.bg} p-2 rounded-lg`}>
                  <statusInfo.icon
                    className={`${sizeClasses.icon} ${statusInfo.color}`}
                    aria-hidden="true"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Main value */}
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline space-x-1">
            <span
              className={`
                ${sizeClasses.value} font-bold text-gray-900
                tabular-nums tracking-tight
                ${loading ? 'loading-skeleton w-24 h-10 rounded' : ''}
              `}
              aria-label={`${title} value: ${formatValue(value)} ${unit}`}
            >
              {!loading && formatValue(value)}
            </span>

            {unit && !loading && (
              <span className="text-sm font-medium text-gray-500 ml-1">
                {unit}
              </span>
            )}
          </div>

          {/* Trend indicator */}
          {showTrend && !loading && change !== 0 && (
            <div
              className={`
                flex items-center space-x-1 px-2 py-1 rounded-full
                ${trendInfo.bg} ${trendInfo.color}
              `}
              role="img"
              aria-label={`${Math.abs(change)}% ${trendInfo.text.toLowerCase()}`}
            >
              <trendInfo.icon className="w-4 h-4" aria-hidden="true" />
              <span className="text-xs font-medium tabular-nums">
                {Math.abs(change).toFixed(1)}%
              </span>
            </div>
          )}
        </div>

        {/* Target progress bar (if target is provided) */}
        {target && !loading && (
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
              <span>Progress to target</span>
              <span>{((value / target) * 100).toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ease-out ${
                  value >= target ? 'bg-success-500' : colorScheme.accent.replace('text-', 'bg-')
                }`}
                style={{ width: `${Math.min((value / target) * 100, 100)}%` }}
                role="progressbar"
                aria-valuenow={value}
                aria-valuemin={0}
                aria-valuemax={target}
                aria-label={`Progress: ${value} out of ${target}`}
              ></div>
            </div>
          </div>
        )}

        {/* Additional info tooltip trigger */}
        {description && (
          <button
            className="absolute top-2 right-2 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onFocus={() => setShowTooltip(true)}
            onBlur={() => setShowTooltip(false)}
            aria-label="More information"
          >
            <InformationCircleIcon className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>

      {/* Tooltip */}
      {showTooltip && description && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-20">
          <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 max-w-xs shadow-lg">
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
            {description}
          </div>
        </div>
      )}

      {/* Focus indicator */}
      <div className="absolute inset-0 pointer-events-none rounded-card border-2 border-transparent transition-colors duration-200 focus-within:border-primary-500"></div>
    </div>
  );
};

/**
 * Metric cards grid container with responsive layout
 */
export const MetricsGrid = ({ children, className = '', columns = 'auto' }) => {
  const getGridClasses = () => {
    if (columns === 'auto') {
      return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6';
    }

    const columnClasses = {
      1: 'grid grid-cols-1',
      2: 'grid grid-cols-1 sm:grid-cols-2',
      3: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
      4: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    };

    return `${columnClasses[columns] || columnClasses[4]} gap-4 lg:gap-6`;
  };

  return (
    <div
      className={`${getGridClasses()} ${className}`}
      role="region"
      aria-label="Key metrics"
    >
      {children}
    </div>
  );
};

/**
 * Skeleton loader for metric cards
 */
export const MetricCardSkeleton = ({ size = 'default' }) => {
  const sizeClasses = {
    small: 'p-4',
    default: 'p-6',
    large: 'p-8',
  };

  return (
    <div className={`bg-white rounded-card shadow-card border border-gray-100 ${sizeClasses[size]}`}>
      <div className="animate-pulse">
        <div className="flex items-start justify-between mb-3">
          <div className="h-4 bg-gray-200 rounded w-24"></div>
          <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
        </div>

        <div className="flex items-baseline justify-between">
          <div className="h-10 bg-gray-200 rounded w-32"></div>
          <div className="h-6 bg-gray-200 rounded-full w-16"></div>
        </div>

        <div className="mt-3">
          <div className="h-2 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    </div>
  );
};

// Export individual components
export default EnhancedMetricCard;
