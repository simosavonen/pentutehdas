import React from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import LoginForm from './LoginForm'

const Navigation = ({ token, login, logout }) => {
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
          <Link to='/' className='level-item'>
            all litters
          </Link>
          {token &&
            <React.Fragment>
              <Link to='/litter' className='level-item'>
                my litters
              </Link>
              <Link to='/dog' className='level-item'>
                my dogs
              </Link>
              <Link to='/user' className='level-item'>
                edit user
              </Link>
            </React.Fragment>
          }

        </div>
        <div className='level-right'>
          <LoginForm
            token={token}
            login={login}
            logout={logout}
          />
        </div>
      </div>


    </nav>
  )
}

export default withRouter(Navigation)