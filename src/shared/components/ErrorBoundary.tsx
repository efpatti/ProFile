"use client";

import { Component, ReactNode } from "react";
import { motion } from "framer-motion";

interface Props {
 children: ReactNode;
 fallback?: ReactNode;
 onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
 hasError: boolean;
 error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
 constructor(props: Props) {
  super(props);
  this.state = { hasError: false, error: null };
 }

 static getDerivedStateFromError(error: Error): State {
  return { hasError: true, error };
 }

 componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
  console.error("ErrorBoundary caught an error:", error, errorInfo);

  this.props.onError?.(error, errorInfo);
 }

 render() {
  if (this.state.hasError) {
   // Custom fallback provided
   if (this.props.fallback) {
    return this.props.fallback;
   }

   return (
    <DefaultErrorFallback
     error={this.state.error}
     reset={() => this.setState({ hasError: false, error: null })}
    />
   );
  }

  return this.props.children;
 }
}

interface FallbackProps {
 error: Error | null;
 reset: () => void;
}

function DefaultErrorFallback({ error, reset }: FallbackProps) {
 return (
  <div className="min-h-screen flex items-center justify-center bg-zinc-900 p-4">
   <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="max-w-md w-full bg-zinc-800 rounded-2xl shadow-2xl p-8 text-center"
   >
    <motion.div
     initial={{ scale: 0 }}
     animate={{ scale: 1 }}
     transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
     className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6"
    >
     <svg
      className="w-8 h-8 text-red-500"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      stroke="currentColor"
     >
      <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
     </svg>
    </motion.div>

    <h1 className="text-2xl font-bold text-white mb-2">
     Oops! Something went wrong
    </h1>

    {/* Description */}
    <p className="text-zinc-400 mb-6">
     We encountered an unexpected error. Don't worry, your data is safe.
    </p>

    {process.env.NODE_ENV === "development" && error && (
     <details className="mb-6 text-left">
      <summary className="cursor-pointer text-sm text-zinc-500 hover:text-zinc-400 mb-2">
       Error Details (Dev Only)
      </summary>
      <pre className="text-xs text-red-400 bg-zinc-900 p-4 rounded-lg overflow-x-auto">
       {error.message}
       {"\n\n"}
       {error.stack}
      </pre>
     </details>
    )}

    <div className="flex flex-col gap-3">
     <button
      onClick={reset}
      className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
     >
      Try Again
     </button>
     <button
      onClick={() => (window.location.href = "/")}
      className="w-full px-6 py-3 bg-zinc-700 hover:bg-zinc-600 text-white font-medium rounded-xl transition-colors"
     >
      Go to Home
     </button>
    </div>

    <p className="text-sm text-zinc-500 mt-6">
     If the problem persists,{" "}
     <a href="/contact" className="text-blue-400 hover:text-blue-300 underline">
      contact support
     </a>
    </p>
   </motion.div>
  </div>
 );
}
