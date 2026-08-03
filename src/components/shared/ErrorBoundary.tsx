import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-bg flex items-center justify-center p-4 dir-rtl">
          <div className="max-w-md w-full bg-surface border border-bdr rounded-3xl p-8 text-center space-y-6 shadow-xl">
            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-txt-primary">حدث خطأ غير متوقع في الصفحة</h2>
              <p className="text-xs text-txt-muted leading-relaxed">
                نعتذر عن هذا الخطأ. تعذر عرض المكون المطلوب بسبب مشكلة أثناء التشغيل.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-surface-secondary border border-bdr rounded-xl text-right overflow-x-auto max-h-32">
                <p className="text-[11px] font-mono text-red-500 dir-ltr text-left">
                  {this.state.error.message || this.state.error.toString()}
                </p>
              </div>
            )}

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReset}
                className="px-4 py-2.5 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-sm"
              >
                <RefreshCw className="w-4 h-4" />
                <span>إعادة المحاولة</span>
              </button>

              <a
                href="/"
                className="px-4 py-2.5 bg-surface-secondary hover:bg-surface-secondary/80 border border-bdr text-txt-primary text-xs font-bold rounded-xl flex items-center gap-2 transition-all"
              >
                <Home className="w-4 h-4" />
                <span>الصفحة الرئيسية</span>
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
