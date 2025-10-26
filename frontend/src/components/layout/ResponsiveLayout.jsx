import React, { useState, useEffect } from 'react';
import { Icon, IconButton } from '../ui/EnhancedIcon';
import { Button } from '../ui/EnhancedButton';
import { OfflineIndicator } from '../common/OfflineIndicator';

/**
 * Mobile-first responsive layout component with accessibility features
 */
export const ResponsiveLayout = ({
  children,
  header,
  sidebar,
  footer,
  className = '',
  sidebarCollapsible = true,
  sidebarDefaultOpen = false,
  showOfflineIndicator = true,
  maxWidth = '7xl',
  ...props
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(sidebarDefaultOpen);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Close sidebar on mobile when clicking outside
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      const handleClickOutside = (event) => {
        if (!event.target.closest('.sidebar') && !event.target.closest('.sidebar-toggle')) {
          setSidebarOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isMobile, sidebarOpen]);

  // Handle escape key to close sidebar
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [sidebarOpen]);

  return (
    <div
      className={`
        min-h-screen bg-gray-50 flex flex-col
        ${className}
      `}
      {...props}
    >
      {/* Skip to main content link for screen readers */}
      <a
        href="#main-content"
        className="skip-link sr-only focus:not-sr-only"
      >
        Skip to main content
      </a>

      {/* Header */}
      {header && (
        <header
          className="
            sticky top-0 z-40 w-full
            bg-white border-b border-gray-200
            shadow-sm
          "
          role="banner"
        >
          <div className={`mx-auto px-4 sm:px-6 lg:px-8 max-w-${maxWidth}`}>
            <div className="flex h-16 items-center justify-between">
              {/* Mobile sidebar toggle */}
              {sidebar && sidebarCollapsible && (
                <div className="flex items-center lg:hidden">
                  <IconButton
                    icon="menu"
                    size="lg"
                    variant="ghost"
                    className="sidebar-toggle -ml-2"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
                    aria-expanded={sidebarOpen}
                    aria-controls="sidebar"
                  />
                </div>
              )}

              {/* Header content */}
              <div className="flex flex-1 items-center justify-between">
                {header}
              </div>

              {/* Desktop sidebar toggle */}
              {sidebar && sidebarCollapsible && (
                <div className="hidden lg:flex items-center ml-4">
                  <IconButton
                    icon="menu"
                    size="lg"
                    variant="ghost"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
                    aria-expanded={sidebarOpen}
                    aria-controls="sidebar"
                  />
                </div>
              )}
            </div>
          </div>
        </header>
      )}

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {sidebar && (
          <>
            {/* Mobile sidebar overlay */}
            {isMobile && sidebarOpen && (
              <div
                className="fixed inset-0 z-40 bg-black bg-opacity-25 lg:hidden"
                aria-hidden="true"
                onClick={() => setSidebarOpen(false)}
              />
            )}

            {/* Sidebar content */}
            <aside
              id="sidebar"
              className={`
                sidebar
                fixed inset-y-0 left-0 z-50 w-64
                transform overflow-y-auto
                bg-white border-r border-gray-200
                transition-transform duration-300 ease-in-out
                lg:static lg:z-auto lg:translate-x-0
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                ${!sidebarOpen && !isMobile ? 'lg:-translate-x-full' : ''}
              `}
              role="complementary"
              aria-label="Sidebar navigation"
              aria-hidden={!sidebarOpen && isMobile}
            >
              <div className="flex h-full flex-col">
                {/* Sidebar header */}
                <div className="flex h-16 shrink-0 items-center justify-between px-6 lg:hidden">
                  <div className="text-lg font-semibold text-gray-900">
                    Menu
                  </div>
                  <IconButton
                    icon="close"
                    size="base"
                    variant="ghost"
                    onClick={() => setSidebarOpen(false)}
                    aria-label="Close sidebar"
                  />
                </div>

                {/* Sidebar content */}
                <div className="flex-1 overflow-y-auto px-4 py-6">
                  {sidebar}
                </div>
              </div>
            </aside>
          </>
        )}

        {/* Main content area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <main
            id="main-content"
            className="flex-1 overflow-y-auto focus:outline-none"
            role="main"
            tabIndex="-1"
          >
            <div className={`mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-${maxWidth}`}>
              {children}
            </div>
          </main>

          {/* Footer */}
          {footer && (
            <footer
              className="
                bg-white border-t border-gray-200
                flex-shrink-0
              "
              role="contentinfo"
            >
              <div className={`mx-auto px-4 sm:px-6 lg:px-8 py-4 max-w-${maxWidth}`}>
                {footer}
              </div>
            </footer>
          )}
        </div>
      </div>

      {/* Offline indicator */}
      {showOfflineIndicator && (
        <OfflineIndicator
          position="top-right"
          showDetails={false}
          className="fixed z-50"
        />
      )}
    </div>
  );
};

/**
 * Header component for the responsive layout
 */
export const LayoutHeader = ({
  title,
  subtitle,
  actions,
  breadcrumbs,
  className = '',
  children,
}) => {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      {/* Title and breadcrumbs */}
      <div className="flex-1 min-w-0">
        {breadcrumbs && (
          <nav className="mb-2" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm text-gray-500">
              {breadcrumbs.map((item, index) => (
                <li key={index} className="flex items-center">
                  {index > 0 && (
                    <Icon
                      name="arrow-right"
                      size="xs"
                      className="mx-2 text-gray-400"
                      decorative
                    />
                  )}
                  {item.href ? (
                    <a
                      href={item.href}
                      className="hover:text-gray-700 transition-colors"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <span
                      className={index === breadcrumbs.length - 1 ? 'text-gray-900 font-medium' : ''}
                    >
                      {item.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        {title && (
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl truncate">
            {title}
          </h1>
        )}

        {subtitle && (
          <p className="mt-1 text-sm text-gray-600 sm:text-base">
            {subtitle}
          </p>
        )}

        {children}
      </div>

      {/* Actions */}
      {actions && (
        <div className="flex items-center space-x-3 ml-4">
          {actions}
        </div>
      )}
    </div>
  );
};

/**
 * Sidebar navigation component
 */
export const LayoutSidebar = ({
  items = [],
  currentPath,
  className = '',
  children,
}) => {
  return (
    <nav className={`space-y-1 ${className}`} aria-label="Main navigation">
      {items.map((item) => (
        <SidebarItem
          key={item.href || item.label}
          {...item}
          active={currentPath === item.href}
        />
      ))}
      {children}
    </nav>
  );
};

/**
 * Individual sidebar item component
 */
export const SidebarItem = ({
  label,
  href,
  icon,
  active = false,
  disabled = false,
  badge,
  onClick,
  className = '',
  children,
}) => {
  const baseClasses = `
    group flex items-center px-3 py-2 text-sm font-medium rounded-md
    transition-colors duration-200
    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1
  `;

  const stateClasses = active
    ? 'bg-primary-100 text-primary-700 border-primary-200'
    : disabled
    ? 'text-gray-400 cursor-not-allowed'
    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900';

  const content = (
    <>
      {icon && (
        <Icon
          name={icon}
          size="base"
          className={`mr-3 flex-shrink-0 ${
            active ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
          }`}
          decorative
        />
      )}
      <span className="flex-1 truncate">{label}</span>
      {badge && (
        <span className={`
          ml-2 inline-block py-0.5 px-2 text-xs rounded-full
          ${active ? 'bg-primary-200 text-primary-800' : 'bg-gray-200 text-gray-800'}
        `}>
          {badge}
        </span>
      )}
      {children}
    </>
  );

  if (href && !disabled) {
    return (
      <a
        href={href}
        className={`${baseClasses} ${stateClasses} ${className}`}
        onClick={onClick}
        aria-current={active ? 'page' : undefined}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      className={`${baseClasses} ${stateClasses} ${className} w-full text-left`}
      onClick={onClick}
      disabled={disabled}
      aria-current={active ? 'page' : undefined}
    >
      {content}
    </button>
  );
};

/**
 * Footer component for the responsive layout
 */
export const LayoutFooter = ({
  links = [],
  copyright,
  className = '',
  children,
}) => {
  const currentYear = new Date().getFullYear();

  return (
    <div className={`text-center sm:text-left ${className}`}>
      {/* Footer links */}
      {links.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap justify-center sm:justify-start gap-6">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                {...(link.external && {
                  target: '_blank',
                  rel: 'noopener noreferrer',
                })}
              >
                {link.label}
                {link.external && (
                  <Icon
                    name="external-link"
                    size="xs"
                    className="ml-1 inline"
                    decorative
                  />
                )}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Custom footer content */}
      {children}

      {/* Copyright */}
      <div className="text-xs text-gray-500">
        {copyright || `© ${currentYear} Government of Goa. All rights reserved.`}
      </div>
    </div>
  );
};

/**
 * Container component for consistent spacing and max-width
 */
export const Container = ({
  children,
  size = 'default',
  className = '',
  ...props
}) => {
  const sizeClasses = {
    sm: 'max-w-2xl',
    default: 'max-w-7xl',
    lg: 'max-w-screen-xl',
    xl: 'max-w-screen-2xl',
    full: 'max-w-none',
  };

  return (
    <div
      className={`
        mx-auto px-4 sm:px-6 lg:px-8
        ${sizeClasses[size] || sizeClasses.default}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Grid container for consistent layout patterns
 */
export const GridContainer = ({
  children,
  cols = 'auto',
  gap = '6',
  className = '',
  ...props
}) => {
  const getGridClasses = () => {
    if (cols === 'auto') {
      return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
    }

    const colClasses = {
      1: 'grid grid-cols-1',
      2: 'grid grid-cols-1 sm:grid-cols-2',
      3: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
      4: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
      6: 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6',
    };

    return colClasses[cols] || colClasses[4];
  };

  return (
    <div
      className={`
        ${getGridClasses()}
        gap-${gap}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Section component for semantic content organization
 */
export const Section = ({
  children,
  title,
  subtitle,
  actions,
  className = '',
  id,
  ...props
}) => {
  return (
    <section
      id={id}
      className={`${className}`}
      {...props}
    >
      {(title || subtitle || actions) && (
        <div className="mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              {title && (
                <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="mt-1 text-sm text-gray-600 sm:text-base">
                  {subtitle}
                </p>
              )}
            </div>
            {actions && (
              <div className="flex items-center space-x-3 ml-4">
                {actions}
              </div>
            )}
          </div>
        </div>
      )}
      {children}
    </section>
  );
};

export default ResponsiveLayout;
