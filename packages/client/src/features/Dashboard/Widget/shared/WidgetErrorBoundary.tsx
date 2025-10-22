import {Core} from '@/shared'
import React from 'react'

type Props = {
  children: React.ReactNode
  fallback?: React.ReactNode
  onClick?: () => void
}

type State = {
  hasError: boolean
  error?: Error
}

export class WidgetErrorBoundary extends React.Component<Props, State> {
  state: State = {hasError: false}

  static getDerivedStateFromError(error: Error) {
    return {hasError: true, error}
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <Core.Alert severity="error" sx={{height: '100%'}} onClick={this.props.onClick}>
            {this.state.error?.message}
          </Core.Alert>
        )
      )
    }
    return this.props.children
  }
}
