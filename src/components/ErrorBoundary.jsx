import React from 'react';
import { AlertTriangle } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // In production this would report to an error-tracking service.
    console.error('NoorStream error boundary caught:', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-noor-danger/15">
            <AlertTriangle className="h-8 w-8 text-noor-danger" />
          </div>
          <h1 className="font-display text-2xl font-bold">Something went wrong</h1>
          <p className="mt-2 max-w-md text-noor-muted">
            We hit an unexpected snag. Please try again — your place is saved.
          </p>
          <button onClick={this.handleReset} className="btn-primary mt-6">
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
