import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
import { useMutation, useApolloClient } from 'react-apollo-hooks'
import { USER, CREATE_USER, USER_AVAILABLE } from '../graphql/user'
import { LOGIN } from '../graphql/login'
import * as Sentry from '@sentry/browser'
import { toast } from 'react-toastify'

let LoginForm = props => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [isNewUser, setIsNewUser] = useState(false)
  const [taken, setTaken] = useState(false)

  const client = useApolloClient()
  const addUser = useMutation(CREATE_USER)
  const login = useMutation(LOGIN)

  const handleLogin = async (username, password) => {
    try {
      const token = await login({
        variables: { username, password },
      })
      localStorage.setItem('pentutehdas-user-token', token.data.login.value)
      client.query({ query: USER, fetchPolicy: 'network-only' })
      toast.success('Succesfully logged in')
      props.history.push('/')
    } catch (error) {
      toast.error('Login failed!')
    }
  }

  const submit = async event => {
    event.preventDefault()

    if (isNewUser) {
      try {
        if (address !== '') {
          throw new Error('not today, spammer')
        }

        await addUser({
          variables: {
            username,
            password,
            phone,
            email,
            city,
          },
        })
        setIsNewUser(false)
        toast.success('New user registered.')
      } catch (error) {
        Sentry.captureException(error)
        toast.error('Failed to create user.')
      }
    } else {
      handleLogin(username, password)
    }
  }

  const checkAvailability = () => {
    client
      .query({
        query: USER_AVAILABLE,
        variables: {
          username: username,
        },
        fetchPolicy: 'no-cache',
      })
      .then(({ data }) => {
        setTaken(!data.userAvailable)
      })
  }

  const toggleRegistering = event => {
    event.preventDefault()
    setIsNewUser(!isNewUser)
  }

  const formStyles = {
    padding: '1em',
  }

  const specialStyles = {
    opacity: 0,
    position: 'absolute',
    top: 0,
    left: 0,
    height: 0,
    width: 0,
    zIndex: -1,
  }

  return (
    <div className='section columns is-centered'>
      <div className='box column is-7-tablet is-6-desktop is-5-widescreen is-4-fullhd'>
        <form style={formStyles} onSubmit={submit}>
          <h1 className='title'>{isNewUser ? 'Register new user' : 'Login'}</h1>
          <div className='field'>
            <div className='control has-icons-left'>
              <input
                id='username'
                className='input'
                type='text'
                placeholder='username'
                value={username}
                pattern='^[a-zåäö0-9]{3,16}$'
                onChange={({ target }) => setUsername(target.value)}
                onBlur={checkAvailability}
                required
                title='Alphanumeric characters, length between 3 and 16.'
              />
              <span className='icon is-left'>
                <i className='fas fa-user' />
              </span>
            </div>
            {isNewUser && taken ? (
              <p className='help has-text-danger'>username not available</p>
            ) : (
              <p className='help'>username, should be unrecognizable</p>
            )}
          </div>

          <div className='field'>
            <div className='control has-icons-left'>
              <input
                id='password'
                className='input'
                type='password'
                placeholder='password'
                value={password}
                pattern='.{6,30}'
                onChange={({ target }) => setPassword(target.value)}
                required
                title='Password length between 6 and 30 characters.'
              />
              <span className='icon is-left'>
                <i className='fas fa-lock' />
              </span>
            </div>
            <p className='help'>password, should be unique</p>
          </div>
          {isNewUser ? (
            <React.Fragment>
              <div className='field'>
                <div className='control has-icons-left'>
                  <input
                    id='phone'
                    className='input'
                    type='text'
                    placeholder='phone'
                    value={phone}
                    onChange={({ target }) => setPhone(target.value)}
                  />
                  <span className='icon is-left'>
                    <i className='fas fa-phone' />
                  </span>
                </div>
                <p className='help'>phone number, prepaid is fine</p>
              </div>

              <div className='field'>
                <div className='control has-icons-left'>
                  <input
                    id='email'
                    className='input'
                    type='text'
                    placeholder='email'
                    value={email}
                    onChange={({ target }) => setEmail(target.value)}
                  />
                  <span className='icon is-left'>
                    <i className='fas fa-at' />
                  </span>
                </div>
                <p className='help'>email address, can be left blank</p>
              </div>

              <div className='field'>
                <div className='control has-icons-left'>
                  <input
                    id='city'
                    className='input'
                    type='text'
                    placeholder='city'
                    value={city}
                    onChange={({ target }) => setCity(target.value)}
                  />
                  <span className='icon is-left'>
                    <i className='fas fa-globe' />
                  </span>
                </div>
                <p className='help'>
                  a city near you, if you intend to sell puppies
                </p>
              </div>

              <div className='field is-grouped'>
                <div className='control'>
                  <button
                    id='register'
                    className='button is-success is-outlined'
                    type='submit'
                  >
                    register
                  </button>
                </div>
                <div className='control'>
                  <button
                    className='button is-danger is-outlined'
                    onClick={toggleRegistering}
                  >
                    cancel
                  </button>
                </div>
              </div>

              <label style={specialStyles} for='address' />
              <input
                style={specialStyles}
                autocomplete='off'
                type='text'
                id='address'
                name='address'
                placeholder='address'
                value={address}
                onChange={({ target }) => setAddress(target.value)}
              />
            </React.Fragment>
          ) : (
            <div className='field is-grouped'>
              <div className='control'>
                <button
                  id='login'
                  className='button is-success is-outlined'
                  type='submit'
                >
                  login
                </button>
              </div>
              <div className='control is-expanded has-text-right'>
                <button className='button is-white' onClick={toggleRegistering}>
                  register new user
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default (LoginForm = withRouter(LoginForm))
