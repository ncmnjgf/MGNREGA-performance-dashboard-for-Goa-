import React from 'react';
import { clsx } from 'clsx';

/**
 * Versatile Button component with multiple variants, sizes, and states
 * Follows accessibility best practices and includes loading states
 */
export const Button = ({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  loadingText = 'Loading...',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  as: Component = 'button',
  type = 'button',
  onClick,
  ...props
}) => {
  const baseClasses = [
    'inline-flex items-center justify-center font-medium rounded-lg',
    'transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
    'touch-target', // Ensures 44px minimum touch target
  ];

  const variants = {
    primary: [
      'bg-primary-600 text-white shadow-sm',
      'hover:bg-primary-700 focus:ring-primary-500',
      'active:bg-primary-800',
    ],
    secondary: [
      'bg-gray-100 text-gray-900',
      'hover:bg-gray-200 focus:ring-gray-500',
      'active:bg-gray-300',
    ],
    outline: [
      'border border-gray-300 bg-white text-gray-700 shadow-sm',
      'hover:bg-gray-50 focus:ring-primary-500',
      'active:bg-gray-100',
    ],
    ghost: [
      'text-gray-600 bg-transparent',
      'hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500',
      'active:bg-gray-200',
    ],
    success: [
      'bg-success-600 text-white shadow-sm',
      'hover:bg-success-700 focus:ring-success-500',
      'active:bg-success-800',
    ],
    warning: [
      'bg-warning-600 text-white shadow-sm',
      'hover:bg-warning-700 focus:ring-warning-500',
      'active:bg-warning-800',
    ],
    error: [
      'bg-error-600 text-white shadow-sm',
      'hover:bg-error-700 focus:ring-error-500',
      'active:bg-error-800',
    ],
    link: [
      'text-primary-600 bg-transparent p-0 h-auto min-h-0 shadow-none',
      'hover:text-primary-700 hover:underline focus:ring-0 focus:outline-none focus:underline',
      'active:text-primary-800',
    ],
  };

  const sizes = {
    xs: 'px-2.5 py-1.5 text-xs min-h-[32px]',
    sm: 'px-3 py-2 text-sm min-h-[36px]',
    md: 'px-4 py-2.5 text-base min-h-[44px]',
    lg: 'px-6 py-3 text-lg min-h-[52px]',
    xl: 'px-8 py-4 text-xl min-h-[56px]',
  };

  // Special handling for link variant
  const isLink = variant === 'link';
  const sizeClass = isLink ? '' : sizes[size];

  const classes = clsx(
    baseClasses,
    variants[variant],
    sizeClass,
    {
      'w-full': fullWidth,
      'cursor-not-allowed opacity-50': disabled || loading,
    },
    className
  );

  const handleClick = (e) => {
    if (disabled || loading) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  const renderIcon = (position) => {
    if (!icon || iconPosition !== position) return null;

    return (
      <span
        className={clsx('flex-shrink-0', {
          'mr-2': position === 'left' && children,
          'ml-2': position === 'right' && children,
        })}
        aria-hidden="true"
      >
        {typeof icon === 'string' ? (
          <span className="w-4 h-4">{icon}</span>
        ) : (
          icon
        )}
      </span>
    );
  };

  const renderLoadingSpinner = () => (
    <svg
      className="animate-spin -ml-1 mr-3 h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  const buttonContent = (
    <>
      {loading && renderLoadingSpinner()}
      {!loading && renderIcon('left')}
      {loading ? loadingText : children}
      {!loading && renderIcon('right')}
    </>
  );

  const buttonProps = {
    className: classes,
    disabled: disabled || loading,
    onClick: handleClick,
    type: Component === 'button' ? type : undefined,
    'aria-disabled': disabled || loading,
    'aria-busy': loading,
    ...props,
  };

  return <Component {...buttonProps}>{buttonContent}</Component>;
};

/**
 * Button Group component for grouping related buttons
 */
export const ButtonGroup = ({
  children,
  className = '',
  orientation = 'horizontal',
  ...props
}) => {
  const orientationClasses = {
    horizontal: 'flex-row',
    vertical: 'flex-col',
  };

  return (
    <div
      className={clsx(
        'flex',
        orientationClasses[orientation],
        className
      )}
      role="group"
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Icon Button component - button with just an icon
 */
export const IconButton = ({
  icon,
  'aria-label': ariaLabel,
  size = 'md',
  variant = 'ghost',
  className = '',
  ...props
}) => {
  if (!ariaLabel) {
    console.warn('IconButton requires an aria-label for accessibility');
  }

  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
  };

  const buttonSizes = {
    xs: 'p-1',
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3',
    xl: 'p-4',
  };

  return (
    <Button
      variant={variant}
      className={clsx('rounded-full', buttonSizes[size], className)}
      aria-label={ariaLabel}
      {...props}
    >
      {typeof icon === 'string' ? (
        <span className={iconSizes[size]}>{icon}</span>
      ) : (
        React.cloneElement(icon, {
          className: clsx(iconSizes[size], icon.props?.className)
        })
      )}
    </Button>
  );
};

/**
 * Floating Action Button component
 */
export const FloatingActionButton = ({
  icon,
  className = '',
  size = 'lg',
  ...props
}) => {
  return (
    <IconButton
      icon={icon}
      size={size}
      variant="primary"
      className={clsx(
        'fixed bottom-6 right-6 shadow-lg hover:shadow-xl z-50',
        'transform hover:scale-105 active:scale-95',
        className
      )}
      {...props}
    />
  );
};

export default Button;
