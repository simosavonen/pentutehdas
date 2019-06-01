import React from 'react'

class ErrorHandler extends React.Component {
  constructor(props) {
    super(props)
    this.state = { errorOccurred: false }
  }

  componentDidCatch(error, info) {
    this.setState({ errorOccurred: true })
    console.log(error, info)
  }

  render() {
    return this.state.errorOccurred
      ? <div className='container'>Error, server is not responding...</div>
      : this.props.children
  }
}

export default ErrorHandler