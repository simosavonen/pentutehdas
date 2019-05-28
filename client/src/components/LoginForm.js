import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'

let LoginForm = (props) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [city, setCity] = useState('')
  const [failed, setFailed] = useState(false)
  const [isNewUser, setIsNewUser] = useState(false)
  const [notification, setNotification] = useState('')
  const [taken, setTaken] = useState(false)

  const submit = async (event) => {
    event.preventDefault()

    if (isNewUser) {
      try {
        await props.addUser({
          variables: {
            username, password, phone, email, city
          }
        })
        setIsNewUser(false)
      } catch (error) {
        console.log(error)
        setNotification('Failed to create user.')
        setFailed(true)
      }
    } else {
      const loginSuccess = await props.login(username, password)
      if (loginSuccess) {
        props.history.push('/')
      } else {
        setNotification('Login failed.')
        setFailed(true)
      }
    }

    //setUsername('')
    //setPassword('')
    //setPhone('')
    //setEmail('')
    //setCity('')
  }

  const checkAvailability = async () => {
    const result = await props.userAvailable({
      variables: { username }
    })
    setTaken(!result.data.userAvailable)
  }

  const toggleRegistering = (event) => {
    event.preventDefault()
    setIsNewUser(!isNewUser)
    setFailed(false)
  }

  const formStyles = {
    padding: '1em'
  }

  return (
    <div className='columns is-centered'>
      <div className='box column is-7-tablet is-6-desktop is-5-widescreen is-4-fullhd'>
        <form style={formStyles} onSubmit={submit}>
          <h1 className='title'>
            {isNewUser ? 'Register new user' : 'Login'}
          </h1>
          <div className={`notification is-danger ${!failed && 'is-hidden'}`}>{notification}</div>

          <div className='field'>
            <div className="control has-icons-left">
              <input
                className='input'
                type='text'
                placeholder='username'
                value={username}
                pattern="^[a-zåäö0-9]{3,16}$"
                onChange={({ target }) => setUsername(target.value)}
                onBlur={checkAvailability}
                required
                title="Alphanumeric characters, length between 3 and 16."
              />
              <span className="icon is-left">
                <i className="fas fa-user"></i>
              </span>
            </div>
            {isNewUser && taken
              ? <p className="help has-text-danger">username not available</p>
              : <p className="help">username, should be unrecognizable</p>
            }
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
            <p className="help">password, should be unique</p>
          </div>
          {isNewUser
            ? <React.Fragment>
              <div className='field'>
                <div className='control has-icons-left'>
                  <input
                    className='input'
                    type='text'
                    placeholder='phone'
                    value={phone}
                    onChange={({ target }) => setPhone(target.value)}
                  />
                  <span className="icon is-left">
                    <i className="fas fa-phone"></i>
                  </span>
                </div>
                <p className="help">phone number, prepaid is fine</p>
              </div>

              <div className='field'>
                <div className='control has-icons-left'>
                  <input
                    className='input'
                    type='text'
                    placeholder='email'
                    value={email}
                    onChange={({ target }) => setEmail(target.value)}
                  />
                  <span className="icon is-left">
                    <i className="fas fa-at"></i>
                  </span>
                </div>
                <p className="help">email address, can be left blank</p>
              </div>

              <div className='field'>
                <div className='control has-icons-left'>
                  <input
                    className='input'
                    type='text'
                    placeholder='city'
                    value={city}
                    onChange={({ target }) => setCity(target.value)}
                  />
                  <span className="icon is-left">
                    <i className="fas fa-globe"></i>
                  </span>
                </div>
                <p className="help">a city near you, if you intend to sell puppies</p>
              </div>

              <div className='field is-grouped'>
                <div className='control'>
                  <button className='button is-success is-outlined' type='submit'>register</button>
                </div>
                <div className='control'>
                  <button className='button is-danger is-outlined' onClick={toggleRegistering}>cancel</button>
                </div>
              </div>
            </React.Fragment>
            : <div className='field is-grouped'>
              <div className='control'>
                <button className='button is-success is-outlined' type='submit'>login</button>
              </div>
              <div className='control is-expanded has-text-right'>
                <button
                  className='button is-white'
                  onClick={toggleRegistering}
                >register new user</button>
              </div>
            </div>
          }
        </form>
      </div>
    </div>
  )
}

export default LoginForm = withRouter(LoginForm)