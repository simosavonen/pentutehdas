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
    <div>
      <form onSubmit={submit}>
        <div className='field is-grouped is-grouped-right'>
          <div className="control has-icons-left">
            <div className='field'>
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
          </div>
          <div className="control has-icons-left">
            <div className='field'>
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
          </div>
          <div className='control'>
            <button className='button is-primary is-small' type='submit'>login</button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default LoginForm