import React, { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
  /** Called when the boundary resets — use with QueryErrorResetBoundary. */
  onReset?: () => void;
}

/**
 * Minimal error boundary for examples.
 * In a real app use react-error-boundary:
 *   https://github.com/bvaughn/react-error-boundary
 */
export class ErrorBoundary extends Component<Props, { error: Error | null }> {
  state = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  reset = () => {
    this.props.onReset?.();
    this.setState({ error: null });
  };

  render() {
    const { error } = this.state;
    if (error) {
      const { fallback } = this.props;
      if (typeof fallback === "function") return fallback(error as Error, this.reset);
      if (fallback !== undefined) return fallback;
      return <p style={{ color: "red" }}>Error: {(error as Error).message}</p>;
    }
    return this.props.children;
  }
}
