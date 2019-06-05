import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Navigation = ({ user, logout }) => {
  const [burgerOpen, setBurgerOpen] = useState(false)

  return (
    <nav className='navbar is-dark' role='navigation'>
      <div className='container'>
        <div className='navbar-brand'>
          <Link to='/' className='navbar-item'>
            <span className='icon is-medium' style={{ marginRight: '0.5em' }}>
              <FontAwesomeIcon
                icon='paw'
                size='2x'
                transform={{ rotate: 45 }}
              />
            </span>{' '}
            PENTUTEHDAS
          </Link>
          <div
            role='button'
            className={`navbar-burger burger ${burgerOpen && 'is-active'}`}
            onClick={() => setBurgerOpen(!burgerOpen)}
          >
            <span />
            <span />
            <span />
          </div>
        </div>
        <div className={`navbar-menu ${burgerOpen && 'is-active'}`}>
          <div className='navbar-start'>
            <Link to='/' className='navbar-item'>
              home
            </Link>
            {user && ['breeder', 'admin'].includes(user.role) && (
              <React.Fragment>
                <Link to='/litter' className='navbar-item'>
                  add a litter
                </Link>
                <Link to='/dog' className='navbar-item'>
                  my dogs
                </Link>
              </React.Fragment>
            )}
            {user && (
              <Link to='/user' className='navbar-item'>
                profile
              </Link>
            )}
            {user && user.role === 'admin' && (
              <Link to='/roles' className='navbar-item'>
                roles
              </Link>
            )}
          </div>
          <div className='navbar-end'>
            {user ? (
              <>
                {' '}
                <p className='navbar-item has-text-grey-light'>
                  Logged in as {user.username}
                </p>{' '}
                <Link to='/' className='navbar-item' onClick={() => logout()}>
                  Logout
                </Link>
              </>
            ) : (
              <Link to='/login' className='navbar-item'>
                Login / Register
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
