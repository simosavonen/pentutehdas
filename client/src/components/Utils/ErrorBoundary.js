import React from 'react'
import * as Sentry from '@sentry/browser'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { errorOccurred: false }
  }

  componentDidCatch(error, info) {
    this.setState({ errorOccurred: true })
    Sentry.captureException(error, info)
  }

  render() {
    return this.state.errorOccurred ? (
      <div className='container'>Error, server is not responding...</div>
    ) : (
      this.props.children
    )
  }
}

export default ErrorBoundary
