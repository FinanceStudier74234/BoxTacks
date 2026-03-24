'use client';

import { Component, type ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center max-w-sm">
            <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={24} className="text-red-400" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 mb-1">
              {this.props.fallbackTitle || 'Something went wrong'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {this.state.error?.message || 'An unexpected error occurred in this section.'}
            </p>
            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
            >
              <RefreshCw size={12} />
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
