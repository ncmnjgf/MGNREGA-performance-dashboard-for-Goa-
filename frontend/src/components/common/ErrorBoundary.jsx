import React from 'react';
import { Icon } from '../ui/EnhancedIcon';
import { Button } from '../ui/EnhancedButton';

/**
 * Error Boundary component to catch and handle React errors gracefully
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // You can also log the error to an error reporting service here
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'exception', {
        description: error.toString(),
        fatal: true
      });
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      const { fallback: Fallback, showDetails = false } = this.props;

      // Custom fallback component
      if (Fallback) {
        return (
          <Fallback
            error={this.state.error}
            errorInfo={this.state.errorInfo}
            resetError={this.handleReset}
          />
        );
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-lg w-full text-center">
            <div className="bg-white rounded-lg shadow-lg p-8">
              {/* Error Icon */}
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <Icon name="exclamation-triangle" size="xl" color="error" />
              </div>

              {/* Error Title */}
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Oops! Something went wrong
              </h1>

              {/* Error Message */}
              <p className="text-gray-600 mb-6 leading-relaxed">
                We encountered an unexpected error while loading the dashboard.
                This might be due to a temporary issue with the application.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={this.handleReload}
                  className="flex items-center justify-center"
                >
                  <Icon name="refresh" size="sm" className="mr-2" />
                  Reload Page
                </Button>

                <Button
                  variant="outline"
                  onClick={this.handleReset}
                  className="flex items-center justify-center"
                >
                  <Icon name="arrow-path" size="sm" className="mr-2" />
                  Try Again
                </Button>
              </div>

              {/* Error Details (Development) */}
              {(showDetails || process.env.NODE_ENV === 'development') && this.state.error && (
                <details className="mt-8 text-left">
                  <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                    Technical Details
                  </summary>
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg text-xs font-mono overflow-auto">
                    <div className="text-red-600 font-semibold mb-2">
                      {this.state.error.toString()}
                    </div>
                    {this.state.errorInfo.componentStack && (
                      <div className="text-gray-700 whitespace-pre-wrap">
                        {this.state.errorInfo.componentStack}
                      </div>
                    )}
                  </div>
                </details>
              )}

              {/* Help Links */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-3">
                  If the problem persists, you can:
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-sm">
                  <a
                    href="/help"
                    className="text-primary-600 hover:text-primary-700 flex items-center"
                  >
                    <Icon name="information-circle" size="sm" className="mr-1" />
                    View Help
                  </a>
                  <a
                    href="mailto:support@mgnrega-goa.gov.in"
                    className="text-primary-600 hover:text-primary-700 flex items-center"
                  >
                    <Icon name="envelope" size="sm" className="mr-1" />
                    Contact Support
                  </a>
                  <a
                    href="/"
                    className="text-primary-600 hover:text-primary-700 flex items-center"
                  >
                    <Icon name="home" size="sm" className="mr-1" />
                    Go Home
                  </a>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <p className="mt-4 text-xs text-gray-500">
              Error ID: {Date.now().toString(36)}
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Higher-order component to wrap components with error boundary
 */
export const withErrorBoundary = (Component, errorBoundaryConfig = {}) => {
  const WrappedComponent = (props) => (
    <ErrorBoundary {...errorBoundaryConfig}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
};

/**
 * Hook for handling async errors in functional components
 */
export const useErrorHandler = () => {
  const [error, setError] = React.useState(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const captureError = React.useCallback((error) => {
    console.error('Async error caught:', error);
    setError(error);
  }, []);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return { captureError, resetError };
};

/**
 * Simple error display component for inline errors
 */
export const ErrorDisplay = ({
  error,
  onRetry,
  showDetails = false,
  className = '',
  size = 'default'
}) => {
  if (!error) return null;

  const sizeClasses = {
    small: 'p-4 text-sm',
    default: 'p-6',
    large: 'p-8 text-lg'
  };

  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg ${sizeClasses[size]} ${className}`}>
      <div className="flex items-start space-x-3">
        <Icon name="exclamation-circle" size="base" color="error" className="flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-red-900 mb-1">
            Something went wrong
          </h3>
          <p className="text-red-800 text-sm">
            {typeof error === 'string' ? error : error.message || 'An unexpected error occurred'}
          </p>

          {showDetails && error.stack && (
            <details className="mt-2">
              <summary className="cursor-pointer text-xs text-red-700 hover:text-red-800">
                Show technical details
              </summary>
              <pre className="mt-2 text-xs text-red-700 bg-red-100 p-2 rounded overflow-auto">
                {error.stack}
              </pre>
            </details>
          )}

          {onRetry && (
            <div className="mt-3">
              <Button
                size="sm"
                variant="outline"
                onClick={onRetry}
                className="text-red-700 border-red-300 hover:bg-red-100"
              >
                <Icon name="refresh" size="sm" className="mr-1" />
                Try Again
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundary;
