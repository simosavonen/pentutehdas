import React from 'react'
import LoginForm from './LoginForm'

const Navigation = ({ token, login, logout, setToken }) => {
  return (
    <div className='container'>
      <h2>Navigation</h2>
      {token
        ? <button onClick={() => logout()}>logout</button>
        : <LoginForm
          login={login}
          setToken={(token) => setToken(token)}
        />
      }
    </div>
  )
}

export default Navigation