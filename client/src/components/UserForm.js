import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'

let UserForm = (props) => {
  const [username, setUsername] = useState(props.user.username)
  const [phone, setPhone] = useState(props.user.phone)
  const [email, setEmail] = useState(props.user.email)
  const [city, setCity] = useState(props.user.city)

  const formStyles = {
    padding: '1em'
  }

  const submit = async (event) => {
    event.preventDefault()
    try {
      await props.updateUser({
        variables: {
          id: props.user.id, username, phone, email, city
        }
      })
      props.history.push('/')
    } catch (error) {
      console.log(error)
    }
  }

  if (!props.user) {
    return (
      <div className='container'>loading...</div>
    )
  }
  return (
    <div className='columns is-centered'>
      <div className='box column is-8-tablet is-7-desktop is-5-widescreen'>
        <form style={formStyles} onSubmit={submit}>
          <h1 className='title'>Edit user</h1>
          <div className='field is-horizontal'>
            <div className='field-label is-normal'>
              <label className="label">username</label>
            </div>
            <div className="field-body">
              <div className='field'>
                <p className='control'>
                  <input
                    className="input"
                    type="text"
                    placeholder="username"
                    value={username}
                    onChange={({ target }) => setUsername(target.value)}
                  />
                </p>
              </div>
            </div>
          </div>

          <div className='field is-horizontal'>
            <div className='field-label is-normal'>
              <label className="label">user role</label>
            </div>
            <div className="field-body">
              <div className='field'>
                <p className='control'>
                  <input
                    className="input is-static"
                    type="text"
                    placeholder="role"
                    readOnly
                    defaultValue={props.user.role}
                  />
                </p>
              </div>
            </div>
          </div>

          <div className='field is-horizontal'>
            <div className='field-label is-normal'>
              <label className="label">phone</label>
            </div>
            <div className="field-body">
              <div className='field'>
                <p className='control'>
                  <input
                    className="input"
                    type="text"
                    placeholder="phone"
                    value={phone}
                    onChange={({ target }) => setPhone(target.value)}
                  />
                </p>
              </div>
            </div>
          </div>

          <div className='field is-horizontal'>
            <div className='field-label is-normal'>
              <label className="label">email</label>
            </div>
            <div className="field-body">
              <div className='field'>
                <p className='control'>
                  <input
                    className="input"
                    type="email"
                    placeholder="email"
                    value={email}
                    onChange={({ target }) => setEmail(target.value)}
                  />
                </p>
              </div>
            </div>
          </div>

          <div className='field is-horizontal'>
            <div className='field-label is-normal'>
              <label className="label">city</label>
            </div>
            <div className="field-body">
              <div className='field'>
                <p className='control'>
                  <input
                    className="input"
                    type="text"
                    placeholder="city"
                    value={city}
                    onChange={({ target }) => setCity(target.value)}
                  />
                </p>
              </div>
            </div>
          </div>

          <div className='field is-horizontal'>
            <div className='field-label is-normal'>
              <label className="label"></label>
            </div>
            <div className="field-body">
              <div className='field is-grouped'>
                <div className='control'>
                  <button className='button is-info is-outlined' type='submit'>save</button>
                </div>
                <div className='control'>
                  <button
                    className='button is-danger is-outlined'
                    onClick={(event) => { event.preventDefault(); props.history.push('/') }}>cancel</button>
                </div>
              </div>
            </div>
          </div>

        </form>
      </div>
    </div>



  )
}

export default UserForm = withRouter(UserForm)