import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'

let LoginForm = (props) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [failed, setFailed] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    if (await props.login(username, password)) {
      props.history.push('/')
    } else {
      setFailed(true)
    }
  }

  const formStyles = {
    padding: '1em'
  }

  return (
    <div className='columns is-centered'>
      <div className='box column is-6-tablet is-5-desktop is-4-widescreen is-3-fullhd'>
        <form style={formStyles} onSubmit={submit}>
          <h1 className='title'>Login</h1>
          <div className={`notification is-danger ${!failed && 'is-hidden'}`}>Login failed.</div>
          <div className='field'>
            <div className="control has-icons-left">
              <input
                className='input'
                type='text'
                placeholder='username'
                value={username}
                pattern="^[a-zåäö0-9]{3,16}$"
                onChange={({ target }) => setUsername(target.value)}
                required
                title="Alphanumeric characters, length between 3 and 16."
              />
              <span className="icon is-left">
                <i className="fas fa-user"></i>
              </span>
            </div>
          </div>

          <div className='field'>
            <div className="control has-icons-left">
              <input
                className='input'
                type='password'
                placeholder='password'
                value={password}
                pattern=".{6,30}"
                onChange={({ target }) => setPassword(target.value)}
                required
                title="Password length between 6 and 30 characters."
              />
              <span className="icon is-left">
                <i className="fas fa-lock"></i>
              </span>
            </div>
          </div>

          <div className='field'>
            <div className='control'>
              <button className='button is-success' type='submit'>login</button>
            </div>
          </div>

        </form>
      </div>
    </div>
  )
}

export default LoginForm = withRouter(LoginForm)