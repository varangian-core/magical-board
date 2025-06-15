'use client'

import React from 'react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen w-screen flex items-center justify-center bg-gradient-starry">
          <div className="magical-card p-8 max-w-md text-center">
            <div className="text-6xl mb-4">💫</div>
            <h2 className="text-2xl font-bold magical-gradient-text mb-4">
              Oops! Something went wrong
            </h2>
            <p className="text-gray-600 mb-6">
              The magic seems to have encountered an issue. Try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="magical-button"
            >
              Refresh Page ✨
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}