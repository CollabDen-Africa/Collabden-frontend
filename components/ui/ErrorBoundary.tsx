"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  /** Heading shown instead of the crashed view */
  title?: string;
  /** Friendly explanation under the heading */
  message?: string;
  /** Adds a "go back" button, e.g. back to the payments overview */
  onBack?: () => void;
  backLabel?: string;
}

interface ErrorBoundaryState {
  error: Error | null;
}

/**
 * Catches errors thrown while rendering its children and shows a friendly message
 * instead of taking the whole page down.
 *
 * Re-mount it with a `key` (e.g. the current tab/step) so it starts fresh whenever the
 * user navigates somewhere else. "Try again" also clears the error without a reload.
 *
 * Limits (React): it does not catch errors in event handlers, async code, or in the
 * component that renders the boundary itself, only in the children below it.
 */
export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Keep the real details for debugging; users only see the friendly text below
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  reset = () => this.setState({ error: null });

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    const {
      title = "This page couldn't be displayed",
      message = "Something went wrong while loading it. Your data hasn't been changed. Please try again, or go back.",
      onBack,
      backLabel = "Go back",
    } = this.props;

    return (
      <div
        role="alert"
        className="mx-auto flex w-full max-w-lg flex-col items-center gap-4 rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-md"
      >
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        <p className="text-sm text-white/60">{message}</p>
        {process.env.NODE_ENV !== "production" && (
          <pre className="max-h-32 w-full overflow-auto rounded-xl bg-black/30 p-3 text-left text-xs text-red-300">
            {error.message}
          </pre>
        )}
        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={this.reset}
            className="rounded-full bg-primary-green px-5 py-2 text-sm font-semibold text-white hover:brightness-110"
          >
            Try again
          </button>
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="rounded-full border border-white/10 px-5 py-2 text-sm font-semibold text-white/70 hover:bg-white/10"
            >
              {backLabel}
            </button>
          )}
        </div>
      </div>
    );
  }
}