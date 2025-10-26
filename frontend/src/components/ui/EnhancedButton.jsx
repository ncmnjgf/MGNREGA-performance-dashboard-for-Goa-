import React, { forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';

/**
 * Enhanced Button component with accessibility and mobile-first design
 */
export const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'default',
  loading = false,
  disabled = false,
  asChild = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  loadingText = 'Loading...',
  ...props
}, ref) => {
  const Comp = asChild ? Slot : 'button';

  // Base styles that apply to all buttons
  const baseStyles = `
    btn-base
    inline-flex items-center justify-center
    font-medium text-center
    border border-transparent
    transition-all duration-200 ease-in-out
    focus:outline-none focus-visible-only
    disabled:opacity-60 disabled:cursor-not-allowed
    ${fullWidth ? 'w-full' : ''}
    ${loading ? 'cursor-wait' : ''}
  `;

  // Size variants with mobile-first approach
  const sizeStyles = {
    xs: 'px-2.5 py-1.5 text-xs gap-1.5 min-h-[32px]',
    sm: 'px-3 py-2 text-sm gap-2 min-h-[36px]',
    default: 'px-4 py-2.5 text-sm gap-2 min-h-[44px]', // 44px for touch targets
    lg: 'px-6 py-3 text-base gap-2.5 min-h-[48px]',
    xl: 'px-8 py-4 text-lg gap-3 min-h-[52px]',
  };

  // Color variants with high contrast ratios
  const variantStyles = {
    primary: `
      bg-primary-600 text-white shadow-sm
      hover:bg-primary-700 hover:shadow-md
      active:bg-primary-800
      focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
      disabled:bg-primary-300
    `,
    secondary: `
      bg-secondary-600 text-white shadow-sm
      hover:bg-secondary-700 hover:shadow-md
      active:bg-secondary-800
      focus:ring-2 focus:ring-secondary-500 focus:ring-offset-2
      disabled:bg-secondary-300
    `,
    outline: `
      bg-transparent text-primary-700 border-primary-300
      hover:bg-primary-50 hover:border-primary-400
      active:bg-primary-100
      focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
      disabled:text-primary-300 disabled:border-primary-200
    `,
    ghost: `
      bg-transparent text-gray-700 shadow-none
      hover:bg-gray-100 hover:text-gray-900
      active:bg-gray-200
      focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
      disabled:text-gray-400
    `,
    danger: `
      bg-error-600 text-white shadow-sm
      hover:bg-error-700 hover:shadow-md
      active:bg-error-800
      focus:ring-2 focus:ring-error-500 focus:ring-offset-2
      disabled:bg-error-300
    `,
    success: `
      bg-success-600 text-white shadow-sm
      hover:bg-success-700 hover:shadow-md
      active:bg-success-800
      focus:ring-2 focus:ring-success-500 focus:ring-offset-2
      disabled:bg-success-300
    `,
    warning: `
      bg-warning-600 text-white shadow-sm
      hover:bg-warning-700 hover:shadow-md
      active:bg-warning-800
      focus:ring-2 focus:ring-warning-500 focus:ring-offset-2
      disabled:bg-warning-300
    `,
  };

  const combinedClassName = `
    ${baseStyles}
    ${sizeStyles[size] || sizeStyles.default}
    ${variantStyles[variant] || variantStyles.primary}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <Comp
      ref={ref}
      className={combinedClassName}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {/* Loading spinner */}
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
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
      )}

      {/* Left icon */}
      {leftIcon && !loading && (
        <span className="flex-shrink-0" aria-hidden="true">
          {leftIcon}
        </span>
      )}

      {/* Button content */}
      <span className={loading ? 'opacity-70' : ''}>
        {loading && loadingText ? loadingText : children}
      </span>

      {/* Right icon */}
      {rightIcon && !loading && (
        <span className="flex-shrink-0" aria-hidden="true">
          {rightIcon}
        </span>
      )}
    </Comp>
  );
});

Button.displayName = 'Button';

/**
 * Icon Button component for buttons with only icons
 */
export const IconButton = forwardRef(({
  children,
  'aria-label': ariaLabel,
  title,
  size = 'default',
  variant = 'ghost',
  className = '',
  ...props
}, ref) => {
  if (!ariaLabel && !title) {
    console.warn('IconButton requires either aria-label or title prop for accessibility');
  }

  const sizeStyles = {
    xs: 'p-1.5 min-w-[32px] min-h-[32px]',
    sm: 'p-2 min-w-[36px] min-h-[36px]',
    default: 'p-2.5 min-w-[44px] min-h-[44px]',
    lg: 'p-3 min-w-[48px] min-h-[48px]',
    xl: 'p-4 min-w-[52px] min-h-[52px]',
  };

  return (
    <Button
      ref={ref}
      variant={variant}
      className={`
        rounded-full
        ${sizeStyles[size] || sizeStyles.default}
        ${className}
      `}
      aria-label={ariaLabel}
      title={title}
      {...props}
    >
      {children}
    </Button>
  );
});

IconButton.displayName = 'IconButton';

/**
 * Button Group component for grouping related buttons
 */
export const ButtonGroup = ({
  children,
  orientation = 'horizontal',
  size = 'default',
  variant,
  className = '',
  ...props
}) => {
  const orientationStyles = {
    horizontal: 'flex-row',
    vertical: 'flex-col',
  };

  return (
    <div
      className={`
        inline-flex
        ${orientationStyles[orientation]}
        ${orientation === 'horizontal' ? 'divide-x divide-gray-200' : 'divide-y divide-gray-200'}
        rounded-button border border-gray-200 shadow-sm
        ${className}
      `}
      role="group"
      {...props}
    >
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            size: child.props.size || size,
            variant: child.props.variant || variant,
            className: `
              ${child.props.className || ''}
              ${orientation === 'horizontal' ? 'first:rounded-r-none last:rounded-l-none' : 'first:rounded-b-none last:rounded-t-none'}
              ${index !== 0 && orientation === 'horizontal' ? 'border-l-0' : ''}
              ${index !== 0 && orientation === 'vertical' ? 'border-t-0' : ''}
              focus:relative focus:z-10
            `,
          });
        }
        return child;
      })}
    </div>
  );
};

/**
 * Toggle Button component for on/off states
 */
export const ToggleButton = forwardRef(({
  pressed = false,
  onPressedChange,
  children,
  variant = 'outline',
  className = '',
  ...props
}, ref) => {
  const handleClick = () => {
    onPressedChange?.(!pressed);
  };

  const pressedStyles = pressed
    ? 'bg-primary-100 text-primary-900 border-primary-300'
    : '';

  return (
    <Button
      ref={ref}
      variant={variant}
      onClick={handleClick}
      aria-pressed={pressed}
      className={`
        ${pressedStyles}
        ${className}
      `}
      {...props}
    >
      {children}
    </Button>
  );
});

ToggleButton.displayName = 'ToggleButton';

/**
 * Link Button component that looks like a button but behaves like a link
 */
export const LinkButton = forwardRef(({
  href,
  external = false,
  children,
  ...props
}, ref) => {
  const linkProps = external
    ? {
        target: '_blank',
        rel: 'noopener noreferrer',
      }
    : {};

  return (
    <Button
      ref={ref}
      asChild
      {...props}
    >
      <a href={href} {...linkProps}>
        {children}
        {external && (
          <svg
            className="ml-1 h-3 w-3"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z"
              clipRule="evenodd"
            />
            <path
              fillRule="evenodd"
              d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </a>
    </Button>
  );
});

LinkButton.displayName = 'LinkButton';

/**
 * Floating Action Button component
 */
export const FloatingActionButton = forwardRef(({
  children,
  position = 'bottom-right',
  size = 'default',
  className = '',
  ...props
}, ref) => {
  const positionStyles = {
    'top-left': 'top-6 left-6',
    'top-right': 'top-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'bottom-right': 'bottom-6 right-6',
  };

  const sizeStyles = {
    sm: 'p-3 min-w-[48px] min-h-[48px]',
    default: 'p-4 min-w-[56px] min-h-[56px]',
    lg: 'p-5 min-w-[64px] min-h-[64px]',
  };

  return (
    <Button
      ref={ref}
      variant="primary"
      className={`
        fixed z-50
        ${positionStyles[position]}
        ${sizeStyles[size]}
        rounded-full
        shadow-lg hover:shadow-xl
        ${className}
      `}
      {...props}
    >
      {children}
    </Button>
  );
});

FloatingActionButton.displayName = 'FloatingActionButton';

export default Button;
