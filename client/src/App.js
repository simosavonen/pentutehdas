import React from 'react'
import { useQuery, useApolloClient } from 'react-apollo-hooks'
import { Subscription } from 'react-apollo'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'

import {
  LitterList,
  Navigation,
  LitterForm,
  LoginForm,
  Dogs,
  UserForm,
  Roles,
  Footer,
  ErrorBoundary,
} from './components'

import { ALL_LITTERS, LITTER_ADDED } from './graphql/litters'
import { USER } from './graphql/user'

const App = () => {
  const client = useApolloClient()
  const { data } = useQuery(USER)

  const handleLogout = () => {
    localStorage.clear()
    toast.info('Logout OK')
    client.resetStore()
  }

  return (
    <div className='site'>
      <Router>
        <Navigation logout={handleLogout} />

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
                    <LitterForm user={data.me} />
                  </div>
                </div>
              )}
            />
            <Route exact path='/dog' render={() => <Dogs user={data.me} />} />
            <Route
              exact
              path='/user'
              render={() => <UserForm user={data.me} />}
            />
            <Route
              exact
              path='/roles'
              render={() => <Roles user={data.me} />}
            />
          </ErrorBoundary>
        </section>
        <Footer />
      </Router>

      <Subscription
        subscription={LITTER_ADDED}
        onSubscriptionData={({ subscriptionData }) => {
          const addedLitter = subscriptionData.data.litterAdded
          const dataInStore = client.readQuery({ query: ALL_LITTERS })
          if (!dataInStore.allLitters.map(p => p.id).includes(addedLitter.id)) {
            dataInStore.allLitters.push(addedLitter)
            client.writeQuery({
              query: ALL_LITTERS,
              data: dataInStore,
            })
            toast.info('A litter was added.')
          }
        }}
      >
        {() => null}
      </Subscription>

      <ToastContainer pauseOnFocusLoss={false} position='bottom-right' />
    </div>
  )
}

export default App
