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
    console.error('NoorStream error boundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full flex-col items-center justify-center px-8 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/15">
            <AlertTriangle className="h-8 w-8 text-rose-400" />
          </div>
          <h1 className="font-display text-xl font-bold">Something went wrong</h1>
          <p className="mt-2 max-w-xs text-sm text-cloud-muted">
            Please reload — your place is saved.
          </p>
          <button onClick={() => this.setState({ hasError: false })} className="btn-noor mt-6">
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
