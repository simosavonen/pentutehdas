import React, { useState, useEffect } from 'react'
import { useMutation, useApolloClient } from 'react-apollo-hooks'
import { Subscription } from 'react-apollo'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'

import * as Sentry from '@sentry/browser'

import {
  LitterList, Navigation, LitterForm, LoginForm,
  Dogs, UserForm, Roles, Footer, ErrorBoundary
} from './components'

import { ALL_LITTERS, LITTER_ADDED } from './graphql/litters'
import { LOGIN } from './graphql/login'
import { USER, UPDATE_USER } from './graphql/user'

const App = () => {
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)

  const client = useApolloClient()

  useEffect(() => {
    setToken(localStorage.getItem('pentutehdas-user-token'))
  }, [])

  useEffect(() => {
    client.query({ query: USER, fetchPolicy: 'no-cache' })
      .then(({ data }) => setUser(data.me))
  }, [client, token])

  const updateUser = useMutation(UPDATE_USER, {
    onError: (error) => Sentry.captureException(error),
    refetchQueries: [{ query: ALL_LITTERS }],
    update: (store, response) => {
      setUser(response.data.updateUser)
      toast.info('User was updated.')
    }
  })

  const login = useMutation(LOGIN)

  const handleLogin = async (username, password) => {
    try {
      const { data } = await login({
        variables: { username, password }
      })
      const token = data.login.value
      setToken(token)
      localStorage.setItem('pentutehdas-user-token', token)
      toast.success('Successfully logged in!')
      return true
    } catch (error) {
      toast.error('Login failed!')
      return false
    }
  }

  const handleLogout = () => {
    setToken(null)
    localStorage.clear()
    toast.info('Logout OK')
    client.resetStore()
  }

  return (
    <div className='site'>
      <Router>
        <Navigation
          user={user}
          logout={handleLogout}
        />

        <section className='section site-content'>
          <ErrorBoundary>
            <Route exact path='/' render={() =>
              <LitterList user={user} />
            } />
            <Route exact path='/login' render={() =>
              <LoginForm login={handleLogin} />
            } />
            <Route exact path='/litter' render={() =>
              user && ['breeder', 'admin'].includes(user.role)
                ? <div className='columns is-centered'>
                  <div className='column is-full-mobile is-two-thirds-tablet is-half-desktop'>
                    <LitterForm user={user} />
                  </div>
                </div>
                : <Redirect to='/' />} />
            <Route exact path='/dog' render={() =>
              user && ['breeder', 'admin'].includes(user.role)
                ? <Dogs user={user} />
                : <Redirect to='/' />} />
            <Route exact path='/user' render={() =>
              user
                ? <UserForm user={user} updateUser={updateUser} />
                : <Redirect to='/' />} />
            <Route exact path='/roles' render={() =>
              user && user.role === 'admin'
                ? <Roles user={user} />
                : <Redirect to='/' />} />
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
              data: dataInStore
            })
            toast.info('A litter was added.')
          }
        }}
      >
        {() => null}
      </Subscription>

      <ToastContainer pauseOnFocusLoss={false} />

    </div>
  )
}

export default App
