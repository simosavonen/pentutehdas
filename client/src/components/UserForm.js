import React, { useState } from 'react'
import { withRouter, Redirect } from 'react-router-dom'

let UserForm = ({ user, updateUser, history }) => {
  const [username, setUsername] = useState(user.username)
  const [phone, setPhone] = useState(user.phone)
  const [email, setEmail] = useState(user.email)
  const [city, setCity] = useState(user.city)

  const formStyles = {
    padding: '1em',
  }

  const submit = async event => {
    event.preventDefault()
    await updateUser({
      variables: {
        id: user.id,
        username,
        phone,
        email,
        city,
      },
    })
    history.push('/')
  }

  if (!user) return <Redirect to='/' />

  return (
    <div className='section columns is-centered'>
      <div className='box column is-8-tablet is-7-desktop is-5-widescreen'>
        <form style={formStyles} onSubmit={submit}>
          <h1 className='title'>Edit user profile</h1>
          <div className='field is-horizontal'>
            <div className='field-label is-normal'>
              <label className='label'>username</label>
            </div>
            <div className='field-body'>
              <div className='field'>
                <p className='control'>
                  <input
                    className='input'
                    type='text'
                    placeholder='username'
                    value={username}
                    onChange={({ target }) => setUsername(target.value)}
                  />
                </p>
              </div>
            </div>
          </div>

          <div className='field is-horizontal'>
            <div className='field-label is-normal'>
              <label className='label'>user role</label>
            </div>
            <div className='field-body'>
              <div className='field'>
                <p className='control'>
                  <input
                    className='input is-static'
                    type='text'
                    placeholder='role'
                    readOnly
                    defaultValue={user.role}
                  />
                </p>
              </div>
            </div>
          </div>

          <div className='field is-horizontal'>
            <div className='field-label is-normal'>
              <label className='label'>phone</label>
            </div>
            <div className='field-body'>
              <div className='field'>
                <p className='control'>
                  <input
                    className='input'
                    type='text'
                    placeholder='phone'
                    value={phone}
                    onChange={({ target }) => setPhone(target.value)}
                  />
                </p>
              </div>
            </div>
          </div>

          <div className='field is-horizontal'>
            <div className='field-label is-normal'>
              <label className='label'>email</label>
            </div>
            <div className='field-body'>
              <div className='field'>
                <p className='control'>
                  <input
                    className='input'
                    type='email'
                    placeholder='email'
                    value={email}
                    onChange={({ target }) => setEmail(target.value)}
                  />
                </p>
              </div>
            </div>
          </div>

          <div className='field is-horizontal'>
            <div className='field-label is-normal'>
              <label className='label'>city</label>
            </div>
            <div className='field-body'>
              <div className='field'>
                <p className='control'>
                  <input
                    id='city'
                    className='input'
                    type='text'
                    placeholder='city'
                    value={city}
                    onChange={({ target }) => setCity(target.value)}
                  />
                </p>
              </div>
            </div>
          </div>

          <div className='field is-horizontal'>
            <div className='field-label is-normal'>
              <label className='label' />
            </div>
            <div className='field-body'>
              <div className='field is-grouped'>
                <div className='control'>
                  <button
                    id='save'
                    className='button is-info is-outlined'
                    type='submit'
                  >
                    save
                  </button>
                </div>
                <div className='control'>
                  <button
                    className='button is-danger is-outlined'
                    onClick={event => {
                      event.preventDefault()
                      history.push('/')
                    }}
                  >
                    cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default (UserForm = withRouter(UserForm))
