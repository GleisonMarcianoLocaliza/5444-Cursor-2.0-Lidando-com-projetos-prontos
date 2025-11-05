import { Component } from 'react';
import type { ReactNode } from 'react';
import { MdErrorOutline } from 'react-icons/md';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-neutral-background flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-neutral-white rounded-lg shadow-elevation-2 p-8 text-center">
            <div className="w-20 h-20 bg-feedback-negative/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <MdErrorOutline className="w-10 h-10 text-feedback-negative" />
            </div>

            <h1 className="font-heading text-heading-lg text-neutral-black mb-3">
              Algo deu errado
            </h1>

            <p className="text-body-md text-neutral-text mb-6">
              Ocorreu um erro inesperado. Por favor, tente recarregar a página.
            </p>

            {import.meta.env.DEV && this.state.error && (
              <div className="mb-6 p-4 bg-neutral-divisor rounded-lg text-left">
                <p className="text-body-sm text-neutral-black font-mono break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <button
              onClick={this.handleReload}
              className="bg-primary-pure hover:bg-primary-dark text-neutral-white font-medium px-6 py-3 rounded-lg transition-colors w-full"
            >
              Recarregar página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
