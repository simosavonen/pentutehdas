import React, { useState } from 'react'

const LoginForm = (props) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const submit = async (event) => {

    event.preventDefault()

    try {
      const result = await props.login({
        variables: { username, password }
      })

      const token = result.data.login.value


      props.setToken(token)
      localStorage.setItem('pentutehdas-user-token', token)

    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='level-item'>
      {!props.token &&
        <form onSubmit={submit}>
          <div className='field is-grouped'>
            <div className="control has-icons-left">
              <input
                className='input is-small'
                type='text'
                placeholder='username'
                value={username}
                onChange={({ target }) => setUsername(target.value)}
              />
              <span className="icon is-small is-left">
                <i className="fas fa-user"></i>
              </span>
            </div>
            <div className="control has-icons-left">
              <input
                className='input is-small'
                type='password'
                placeholder='password'
                value={password}
                onChange={({ target }) => setPassword(target.value)}
              />
              <span className="icon is-small is-left">
                <i className="fas fa-lock"></i>
              </span>
            </div>
            <div className='control'>
              <button className='button is-success is-small' type='submit'>login</button>
            </div>

          </div>
        </form>
      }
      {props.token &&
        <div className='field is-horizontal'>
          <div className='field-label is-small'>
            <label className='label'>Logged in </label>
          </div>
          <button className='button is-warning is-small' onClick={props.logout}>logout</button>
        </div>
      }

    </div>
  )
}

export default LoginForm