import React from 'react';
import { Icon } from '../ui/EnhancedIcon';

/**
 * Loading spinner component with various sizes and styles
 */
export const LoadingSpinner = ({
  size = 'base',
  color = 'primary',
  className = '',
  label = 'Loading...',
  showLabel = false,
  variant = 'spinner',
  ...props
}) => {
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    base: 'w-5 h-5',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
    '2xl': 'w-16 h-16',
  };

  const colorClasses = {
    primary: 'border-primary-200 border-t-primary-600',
    secondary: 'border-secondary-200 border-t-secondary-600',
    success: 'border-success-200 border-t-success-600',
    warning: 'border-warning-200 border-t-warning-600',
    error: 'border-error-200 border-t-error-600',
    info: 'border-info-200 border-t-info-600',
    white: 'border-white border-opacity-30 border-t-white',
    gray: 'border-gray-200 border-t-gray-600',
  };

  if (variant === 'dots') {
    return (
      <div className={`flex items-center space-x-1 ${className}`} {...props}>
        <div className={`${sizeClasses[size]} bg-current rounded-full animate-pulse`} style={{ animationDelay: '0s' }} />
        <div className={`${sizeClasses[size]} bg-current rounded-full animate-pulse`} style={{ animationDelay: '0.2s' }} />
        <div className={`${sizeClasses[size]} bg-current rounded-full animate-pulse`} style={{ animationDelay: '0.4s' }} />
        {showLabel && (
          <span className="ml-2 text-sm text-gray-600" aria-live="polite">
            {label}
          </span>
        )}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={`flex items-center ${className}`} {...props}>
        <div className={`${sizeClasses[size]} bg-current rounded-full animate-pulse opacity-75`} />
        {showLabel && (
          <span className="ml-2 text-sm text-gray-600" aria-live="polite">
            {label}
          </span>
        )}
      </div>
    );
  }

  // Default spinner variant
  return (
    <div className={`flex items-center ${className}`} {...props}>
      <div
        className={`
          ${sizeClasses[size]}
          ${colorClasses[color] || colorClasses.primary}
          border-2 border-solid rounded-full animate-spin
        `}
        role="status"
        aria-label={label}
      />
      {showLabel && (
        <span className="ml-2 text-sm text-gray-600" aria-live="polite">
          {label}
        </span>
      )}
    </div>
  );
};

/**
 * Full page loading overlay
 */
export const LoadingOverlay = ({
  message = 'Loading...',
  backdrop = true,
  className = '',
  children,
  ...props
}) => {
  return (
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center
        ${backdrop ? 'bg-white bg-opacity-75 backdrop-blur-sm' : ''}
        ${className}
      `}
      {...props}
    >
      <div className="text-center">
        {children || (
          <>
            <LoadingSpinner size="xl" showLabel={false} />
            <p className="mt-4 text-lg font-medium text-gray-900">
              {message}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

/**
 * Inline loading state component
 */
export const LoadingInline = ({
  message = 'Loading...',
  size = 'sm',
  className = '',
  ...props
}) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`} {...props}>
      <LoadingSpinner size={size} showLabel={false} />
      <span className="text-sm text-gray-600">{message}</span>
    </div>
  );
};

/**
 * Loading button state
 */
export const LoadingButton = ({
  loading = false,
  children,
  loadingText = 'Loading...',
  className = '',
  ...props
}) => {
  return (
    <button
      className={`
        inline-flex items-center justify-center
        ${loading ? 'cursor-wait opacity-75' : ''}
        ${className}
      `}
      disabled={loading}
      {...props}
    >
      {loading && (
        <LoadingSpinner size="sm" className="mr-2" showLabel={false} />
      )}
      {loading ? loadingText : children}
    </button>
  );
};

export default LoadingSpinner;
