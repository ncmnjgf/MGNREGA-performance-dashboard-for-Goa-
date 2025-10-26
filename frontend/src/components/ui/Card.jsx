import React from 'react';
import { clsx } from 'clsx';

/**
 * Base Card component with various styles and hover effects
 * Supports different variants and interactive states
 */
export const Card = ({
  children,
  className = '',
  onClick,
  variant = 'default',
  padding = 'default',
  shadow = 'soft',
  interactive = false,
  as: Component = 'div',
  ...props
}) => {
  const baseClasses = 'bg-white rounded-xl border border-gray-100 transition-all duration-200';

  const variants = {
    default: '',
    metric: 'hover:shadow-card-hover cursor-pointer transform hover:-translate-y-1',
    outline: 'border-2 border-gray-200',
    ghost: 'bg-transparent border-0 shadow-none',
  };

  const paddings = {
    none: 'p-0',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8',
  };

  const shadows = {
    none: 'shadow-none',
    soft: 'shadow-soft',
    card: 'shadow-card',
    lg: 'shadow-lg',
  };

  const classes = clsx(
    baseClasses,
    variants[variant],
    paddings[padding],
    shadows[shadow],
    {
      'cursor-pointer hover:shadow-card': interactive && !onClick && variant !== 'metric',
      'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2': onClick || interactive,
    },
    className
  );

  const handleClick = onClick || (interactive ? () => {} : undefined);
  const handleKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && handleClick) {
      e.preventDefault();
      handleClick(e);
    }
  };

  return (
    <Component
      className={classes}
      onClick={handleClick}
      onKeyDown={handleClick ? handleKeyDown : undefined}
      tabIndex={handleClick ? 0 : undefined}
      role={handleClick ? 'button' : undefined}
      {...props}
    >
      {children}
    </Component>
  );
};

/**
 * Card Header component
 */
export const CardHeader = ({ children, className = '', ...props }) => (
  <div className={clsx('mb-4', className)} {...props}>
    {children}
  </div>
);

/**
 * Card Body component
 */
export const CardBody = ({ children, className = '', ...props }) => (
  <div className={clsx('flex-1', className)} {...props}>
    {children}
  </div>
);

/**
 * Card Footer component
 */
export const CardFooter = ({ children, className = '', ...props }) => (
  <div className={clsx('mt-4 pt-4 border-t border-gray-100', className)} {...props}>
    {children}
  </div>
);

/**
 * Card Title component
 */
export const CardTitle = ({ children, className = '', level = 3, ...props }) => {
  const Component = `h${level}`;
  const levelClasses = {
    1: 'text-2xl font-bold',
    2: 'text-xl font-semibold',
    3: 'text-lg font-medium',
    4: 'text-base font-medium',
  };

  return (
    <Component
      className={clsx('text-gray-900', levelClasses[level], className)}
      {...props}
    >
      {children}
    </Component>
  );
};

/**
 * Card Description component
 */
export const CardDescription = ({ children, className = '', ...props }) => (
  <p className={clsx('text-sm text-gray-600 mt-1', className)} {...props}>
    {children}
  </p>
);

export default Card;
