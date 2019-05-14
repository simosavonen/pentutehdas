import React from 'react'

const UserForm = ({ user }) => {

  if (!user) {
    return (
      <div className='container'>loading...</div>
    )
  }
  return (
    <div className='container'>
      <form className='box'>
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
                  value={user.username}
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
                  value={user.role}
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
                  value={user.phone}
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
                  value={user.email}
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
                  value={user.city}
                />
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>



  )
}

export default UserForm