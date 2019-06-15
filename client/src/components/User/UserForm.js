import React, { useState, useContext } from 'react'
import { withRouter, Redirect } from 'react-router-dom'
import { useMutation } from 'react-apollo-hooks'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ALL_LITTERS } from '../../graphql/litters'
import { UPDATE_USER } from '../../graphql/user'
import { UserContext } from '..'

let UserForm = props => {
  const userContext = useContext(UserContext)
  const { user, setUser } = userContext

  const [phone, setPhone] = useState(user ? user.phone : '')
  const [email, setEmail] = useState(user ? user.email : '')
  const [city, setCity] = useState(user ? user.city : '')

  const updateUser = useMutation(UPDATE_USER, {
    refetchQueries: [{ query: ALL_LITTERS }],
    update: (store, response) => {
      const updatedUser = response.data.updateUser
      setUser(updatedUser)
      toast.info('User was updated.')
    },
  })

  const formStyles = {
    padding: '1em',
  }

  const submit = async event => {
    event.preventDefault()
    await updateUser({
      variables: {
        id: user.id,
        username: user.username,
        phone,
        email,
        city,
      },
    })
    props.history.push('/')
  }

  if (!user) return <Redirect to='/' />

  return (
    <div className='section columns is-centered'>
      <div className='box column is-12-tablet is-9-desktop is-8-widescreen is-7-fullhd'>
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
                    className='input is-static'
                    type='text'
                    placeholder='username'
                    readOnly
                    defaultValue={user.username}
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
                <p className='control has-icons-left'>
                  <input
                    className='input'
                    type='text'
                    placeholder='phone'
                    value={phone}
                    onChange={({ target }) => setPhone(target.value)}
                  />
                  <span className='icon is-left'>
                    <FontAwesomeIcon icon='phone' />
                  </span>
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
                <p className='control has-icons-left'>
                  <input
                    className='input'
                    type='email'
                    placeholder='email'
                    value={email}
                    onChange={({ target }) => setEmail(target.value)}
                  />
                  <span className='icon is-left'>
                    <FontAwesomeIcon icon='at' />
                  </span>
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
                <p className='control has-icons-left'>
                  <input
                    id='city'
                    className='input'
                    type='text'
                    placeholder='city'
                    value={city}
                    onChange={({ target }) => setCity(target.value)}
                  />
                  <span className='icon is-left'>
                    <FontAwesomeIcon icon='globe' />
                  </span>
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
                    id='cancel'
                    className='button is-danger is-outlined'
                    onClick={event => {
                      event.preventDefault()
                      props.history.push('/')
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
