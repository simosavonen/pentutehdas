import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useApolloClient } from 'react-apollo-hooks'
import { USER } from '../graphql/user'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { toast } from 'react-toastify'

const Navigation = () => {
  const [burgerOpen, setBurgerOpen] = useState(false)
  const client = useApolloClient()
  const user = useQuery(USER)

  const handleLogout = () => {
    localStorage.clear()
    client.resetStore()
    toast.info('Logout OK')
  }

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
            {user.data.me && ['breeder', 'admin'].includes(user.data.me.role) && (
              <React.Fragment>
                <Link to='/litter' className='navbar-item'>
                  add a litter
                </Link>
                <Link to='/dog' className='navbar-item'>
                  my dogs
                </Link>
              </React.Fragment>
            )}
            {user.data.me && (
              <Link to='/user' className='navbar-item'>
                profile
              </Link>
            )}
            {user.data.me && user.data.me.role === 'admin' && (
              <Link to='/roles' className='navbar-item'>
                roles
              </Link>
            )}
          </div>
          <div className='navbar-end'>
            {user.data.me ? (
              <>
                {' '}
                <p className='navbar-item has-text-grey-light'>
                  Logged in as {user.data.me.username}
                </p>{' '}
                <Link
                  to='/'
                  className='navbar-item'
                  onClick={() => handleLogout()}
                >
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
