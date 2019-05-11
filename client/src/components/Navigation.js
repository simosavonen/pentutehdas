import React from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import LoginForm from './LoginForm'

const Navigation = ({ token, login, logout, setToken, user }) => {
  return (
    <nav className='hero is-small is-info is-bold'>
      <div className='hero-body level'>
        <div className='level-left'>
          <Link to='/' className='level-item'>
            <span className='icon is-large'>
              <i className='fas fa-paw fa-2x'></i>
            </span> PENTUTEHDAS
          </Link>
          <div className='level-item'> </div>
          {token &&
            <React.Fragment>
              <Link to='/litter' className='level-item'>
                add a litter
              </Link>
              <Link to='/dog' className='level-item'>
                add a dog
              </Link>
            </React.Fragment>
          }

        </div>
        <div className='level-right'>
          <LoginForm
            token={token}
            login={login}
            logout={() => logout()}
          />
        </div>
      </div>


    </nav>
  )
}

export default withRouter(Navigation)