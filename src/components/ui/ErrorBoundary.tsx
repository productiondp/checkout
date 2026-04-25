"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[CRITICAL_RUNTIME_ERROR]", error, errorInfo);
    // Track runtime crash for production monitoring
    import("@/utils/analytics").then(({ analytics }) => {
      analytics.track('PROFILE_FETCH_FAILURE', undefined, { 
        isCrash: true,
        errorMessage: error.message,
        componentStack: errorInfo.componentStack 
      });
    });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 p-6 selection:bg-[#E53935]/10">
           <div className="w-full max-w-md bg-white rounded-[3rem] p-12 shadow-4xl border border-slate-100 text-center animate-in zoom-in-95 duration-500">
              <div className="h-20 w-20 bg-red-50 text-[#E53935] rounded-3xl mx-auto mb-8 flex items-center justify-center">
                 <AlertCircle size={40} />
              </div>
              <h2 className="text-2xl font-black text-[#292828] uppercase mb-4 tracking-tight">Something went wrong</h2>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed mb-10">
                 A critical runtime error occurred. Our engineers have been notified.
              </p>
              
              <button 
                onClick={() => window.location.reload()}
                className="w-full h-16 bg-[#292828] text-white rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#E53935] transition-all shadow-xl active:scale-95"
              >
                 <RefreshCw size={18} /> Reload System
              </button>
           </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
