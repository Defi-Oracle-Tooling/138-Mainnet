import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });
    
    // Log to error reporting service
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="p-6 space-y-4">
          <Alert variant="destructive">
            <h2 className="text-lg font-semibold">Something went wrong</h2>
            <p className="text-sm">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
          </Alert>
          
          <div className="space-x-4">
            <Button onClick={this.handleReset}>
              Try Again
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Reload Page
            </Button>
          </div>

          {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
            <pre className="mt-4 p-4 bg-gray-100 rounded text-sm overflow-auto">
              {this.state.errorInfo.componentStack}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
