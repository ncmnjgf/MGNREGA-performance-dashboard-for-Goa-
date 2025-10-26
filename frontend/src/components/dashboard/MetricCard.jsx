import React from 'react';
import { Card } from '../ui/Card';
import { Icon, TrendIcon, MetricIcon } from '../ui/Icon';
import { formatters } from '../../utils/api';
import { clsx } from 'clsx';

/**
 * MetricCard component for displaying key performance indicators
 * Features large numbers, icons, trend indicators, and accessibility support
 */
export const MetricCard = ({
  type,
  title,
  value,
  unit = '',
  change,
  changeType = 'neutral',
  loading = false,
  error = null,
  onClick,
  className = '',
  showDetails = true,
  ...props
}) => {
  const handleClick = onClick ? () => onClick({ type, title, value, unit }) : undefined;
  const handleKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && handleClick) {
      e.preventDefault();
      handleClick();
    }
  };

  if (loading) {
    return <MetricCardSkeleton className={className} />;
  }

  if (error) {
    return <MetricCardError error={error} className={className} />;
  }

  // Format value based on type
  const formattedValue = formatValue(value, type);
  const screenReaderValue = formatters.formatForScreenReader(value, unit);

  return (
    <Card
      variant="metric"
      className={clsx('metric-card group', className)}
      onClick={handleClick}
      onKeyDown={handleClick ? handleKeyDown : undefined}
      tabIndex={handleClick ? 0 : undefined}
      role={handleClick ? 'button' : 'article'}
      aria-label={`${title}: ${screenReaderValue}${change ? `, ${formatChangeForScreenReader(change, changeType)}` : ''}`}
      {...props}
    >
      <div className="metric-header">
        <MetricIcon
          type={type}
          className="metric-icon transition-transform group-hover:scale-110"
          aria-hidden="true"
        />
        <h3 className="metric-title">
          {title}
        </h3>
      </div>

      <div className="metric-body">
        <div
          className="metric-value"
          aria-label={screenReaderValue}
        >
          {formattedValue}
        </div>
        {unit && (
          <div className="metric-unit" aria-hidden="true">
            {unit}
          </div>
        )}
      </div>

      {change && showDetails && (
        <div className={clsx('metric-change', `metric-change--${changeType}`)}>
          <TrendIcon
            direction={changeType === 'positive' ? 'up' : changeType === 'negative' ? 'down' : 'neutral'}
            size="sm"
            aria-hidden="true"
          />
          <span>{formatChange(change, changeType)}</span>
        </div>
      )}

      {handleClick && showDetails && (
        <div className="metric-footer opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-xs text-gray-500 flex items-center gap-1">
            Click for details
            <Icon name="external-link" size="xs" />
          </span>
        </div>
      )}
    </Card>
  );
};

/**
 * Loading skeleton for MetricCard
 */
const MetricCardSkeleton = ({ className = '' }) => (
  <Card variant="default" className={clsx('animate-pulse', className)}>
    <div className="metric-header">
      <div className="w-8 h-8 bg-gray-200 rounded-lg" />
      <div className="h-6 bg-gray-200 rounded w-24" />
    </div>
    <div className="metric-body">
      <div className="h-10 bg-gray-200 rounded w-20 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-16" />
    </div>
    <div className="metric-change">
      <div className="h-4 bg-gray-200 rounded w-16" />
    </div>
  </Card>
);

/**
 * Error state for MetricCard
 */
const MetricCardError = ({ error, className = '' }) => (
  <Card variant="outline" className={clsx('border-error-200 bg-error-50', className)}>
    <div className="metric-header">
      <Icon
        name="alert-triangle"
        className="text-error-600 w-8 h-8 p-2 bg-error-100 rounded-lg"
        aria-hidden="true"
      />
      <h3 className="metric-title text-error-700">
        Data Error
      </h3>
    </div>
    <div className="metric-body">
      <div className="text-error-600 text-sm">
        {error || 'Unable to load data'}
      </div>
    </div>
  </Card>
);

/**
 * Grid container for multiple metric cards
 */
export const MetricsGrid = ({ children, className = '', ...props }) => (
  <div
    className={clsx('metrics-grid', className)}
    role="region"
    aria-label="Key performance metrics"
    {...props}
  >
    {children}
  </div>
);

/**
 * Compact version of MetricCard for smaller spaces
 */
export const CompactMetricCard = ({
  type,
  title,
  value,
  unit = '',
  className = '',
  ...props
}) => {
  const formattedValue = formatValue(value, type);

  return (
    <div
      className={clsx(
        'bg-white rounded-lg border border-gray-100 p-4',
        'flex items-center gap-3 hover:shadow-card transition-shadow',
        className
      )}
      {...props}
    >
      <MetricIcon type={type} size="md" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-700 truncate">
          {title}
        </p>
        <p className="text-lg font-semibold text-gray-900">
          {formattedValue} {unit}
        </p>
      </div>
    </div>
  );
};

/**
 * Large hero-style metric card for primary metrics
 */
export const HeroMetricCard = ({
  type,
  title,
  value,
  unit = '',
  subtitle,
  className = '',
  ...props
}) => {
  const formattedValue = formatValue(value, type);

  return (
    <Card
      variant="default"
      padding="lg"
      className={clsx('text-center', className)}
      {...props}
    >
      <MetricIcon type={type} className="mx-auto mb-4" />
      <h2 className="text-3xl font-bold text-gray-900 mb-2">
        {formattedValue}
        {unit && <span className="text-xl font-normal text-gray-600 ml-1">{unit}</span>}
      </h2>
      <p className="text-lg font-medium text-gray-700 mb-1">
        {title}
      </p>
      {subtitle && (
        <p className="text-sm text-gray-600">
          {subtitle}
        </p>
      )}
    </Card>
  );
};

// Helper functions
function formatValue(value, type) {
  if (value === null || value === undefined || isNaN(value)) {
    return '—';
  }

  switch (type) {
    case 'money':
      return formatters.formatCurrency(value);
    case 'progress':
    case 'completion':
      return formatters.formatPercentage(value);
    default:
      return formatters.formatNumber(value);
  }
}

function formatChange(change, changeType) {
  if (!change) return '';

  // If change is already formatted (contains %)
  if (typeof change === 'string' && (change.includes('%') || change.includes('+'))) {
    return change;
  }

  // If change is a number
  if (typeof change === 'number') {
    const sign = changeType === 'positive' ? '+' : changeType === 'negative' ? '' : '';
    return `${sign}${Math.abs(change)}%`;
  }

  return change;
}

function formatChangeForScreenReader(change, changeType) {
  const formattedChange = formatChange(change, changeType);
  const direction = changeType === 'positive' ? 'increased' :
                   changeType === 'negative' ? 'decreased' : 'changed';

  return `${direction} by ${formattedChange}`;
}

export default MetricCard;
