import React from 'react'
import LoginForm from './LoginForm'


const Navigation = ({ token, login, logout, setToken }) => {
  return (
    <nav className='hero is-small is-info is-bold'>
      <div className='hero-body level'>
        <div className='level-left'>
          <div className='level-item' href='index.html'>
            <span className='icon is-large'>
              <i className='fas fa-paw fa-2x'></i>
            </span> PENTUTEHDAS
          </div>
          <div className='level-item'> </div>
          {token &&
            <>
              <div className='level-item'>
                litters
            </div>
              <div className='level-item'>
                dogs
          </div>
            </>
          }

        </div>
        <div className='level-right'>
          <LoginForm
            token={token}
            login={login}
            logout={() => logout()}
            setToken={(token) => setToken(token)}
          />
        </div>
      </div>


    </nav>
  )
}

export default Navigation