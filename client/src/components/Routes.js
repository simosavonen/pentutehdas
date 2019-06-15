import React from 'react'
import { Route, Switch } from 'react-router-dom'
import {
  Dogs,
  ErrorBoundary,
  LitterForm,
  LitterList,
  LoginForm,
  NoMatch,
  Roles,
  UserForm,
} from '../components'

const Routes = () => {
  return (
    <section className='section site-content'>
      <ErrorBoundary>
        <Switch>
          <Route exact path='/' component={LitterList} />
          <Route exact path='/login' component={LoginForm} />
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
          <Route exact path='/dog' component={Dogs} />
          <Route exact path='/user' component={UserForm} />
          <Route exact path='/roles' component={Roles} />
          <Route component={NoMatch} />
        </Switch>
      </ErrorBoundary>
    </section>
  )
}

export default Routes
