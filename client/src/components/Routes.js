import React from 'react'
import { Route } from 'react-router-dom'
import {
  LitterList,
  LitterForm,
  LoginForm,
  Dogs,
  UserForm,
  Roles,
  ErrorBoundary,
} from '../components'

const Routes = () => {
  return (
    <section className='section site-content'>
      <ErrorBoundary>
        <Route exact path='/' render={() => <LitterList />} />
        <Route exact path='/login' render={() => <LoginForm />} />
        <Route
          exact
          path='/litter'
          render={() => (
            <div className='section columns is-centered'>
              <div className='column is-full-mobile is-two-thirds-tablet is-half-desktop'>
                <LitterForm />
              </div>
            </div>
          )}
        />
        <Route exact path='/dog' render={() => <Dogs />} />
        <Route exact path='/user' render={() => <UserForm />} />
        <Route exact path='/roles' render={() => <Roles />} />
      </ErrorBoundary>
    </section>
  )
}

export default Routes
