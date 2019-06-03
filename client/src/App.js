import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useApolloClient } from 'react-apollo-hooks'
import { Subscription } from 'react-apollo'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'

import * as Sentry from '@sentry/browser'

import {
  LitterList, Navigation, LitterForm, LoginForm,
  Dogs, UserForm, Roles, Footer, ErrorHandler
} from './components'

import { ALL_LITTERS, LITTER_ADDED } from './graphql/litters'
import { ALL_DOGS, CREATE_DOG, DELETE_DOG } from './graphql/dogs'
import { LOGIN } from './graphql/login'
import { USER, CREATE_USER, UPDATE_USER, USER_AVAILABLE } from './graphql/user'

const App = () => {
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)

  const client = useApolloClient()

  useEffect(() => {
    setToken(localStorage.getItem('pentutehdas-user-token'))
  }, [])

  useEffect(() => {
    client.query({ query: USER, fetchPolicy: 'network-only' })
      .then(result => { setUser(result.data.me) })
  }, [client, token])

  const handleError = (error) => {
    Sentry.captureException(error)
  }

  const includedIn = (set, object) =>
    set.map(p => p.id).includes(object.id)

  const allLitters = useQuery(ALL_LITTERS)
  const allDogs = useQuery(ALL_DOGS)
  const userAvailable = useMutation(USER_AVAILABLE)
  const login = useMutation(LOGIN)
  const addDog = useMutation(CREATE_DOG, {
    onError: handleError,
    update: (store, response) => {
      const dataInStore = store.readQuery({ query: ALL_DOGS })
      dataInStore.allDogs.push(response.data.addDog)
      store.writeQuery({
        query: ALL_DOGS,
        data: dataInStore
      })
      toast.info('Dog was added.')
    }
  })

  const addUser = useMutation(CREATE_USER, {
    onError: handleError
  })

  const updateUser = useMutation(UPDATE_USER, {
    onError: handleError,
    refetchQueries: [{ query: ALL_LITTERS }],
    update: (store, response) => {
      setUser(response.data.updateUser)
      toast.info('User was updated.')
    }
  })


  const deleteDog = useMutation(DELETE_DOG, {
    onError: handleError,
    update: (store, response) => {
      const dataInStore = store.readQuery({ query: ALL_DOGS })
      dataInStore.allDogs = dataInStore.allDogs.filter(dog => dog.id !== response.data.deleteDog.id)
      store.writeQuery({
        query: ALL_DOGS,
        data: dataInStore
      })
      toast.info('Dog was removed.')
    }
  })

  const handleLogout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
    toast.info('Logout OK')
  }

  const handleLogin = async (username, password) => {
    try {
      const result = await login({
        variables: { username, password }
      })
      const token = result.data.login.value
      setToken(token)
      localStorage.setItem('pentutehdas-user-token', token)
      toast.success('Successfully logged in!')
      return true
    } catch (error) {
      toast.error('Login failed!')
      return false
    }
  }


  return (
    <div className='site'>
      <Router>
        <Navigation
          user={user}
          logout={handleLogout}
        />

        <section className='section site-content'>
          <Route exact path='/' render={() =>
            <ErrorHandler>
              <LitterList
                litters={allLitters}
                dogs={allDogs}
                user={user}
              />
            </ErrorHandler>
          } />
          <Route exact path='/login' render={() =>
            <LoginForm
              login={handleLogin}
              addUser={addUser}
              userAvailable={userAvailable}
            />} />
          <Route exact path='/litter' render={() =>
            user && ['breeder', 'admin'].includes(user.role)
              ? <div className='columns is-centered'>
                <div className='column is-full-mobile is-two-thirds-tablet is-half-desktop'>
                  <LitterForm
                    user={user}
                    dogs={allDogs}
                  />
                </div>
              </div>
              : <Redirect to='/' />} />
          <Route exact path='/dog' render={() =>
            user && ['breeder', 'admin'].includes(user.role)
              ? <Dogs
                user={user}
                dogs={allDogs}
                addDog={addDog}
                deleteDog={deleteDog}
              />
              : <Redirect to='/' />} />
          <Route exact path='/user' render={() =>
            user
              ? <UserForm user={user} updateUser={updateUser} />
              : <Redirect to='/' />} />
          <Route exact path='/roles' render={() =>
            user && user.role === 'admin'
              ? <Roles user={user} />
              : <Redirect to='/' />} />
        </section>
        <Footer />

      </Router>

      <Subscription
        subscription={LITTER_ADDED}
        onSubscriptionData={({ subscriptionData }) => {
          const addedLitter = subscriptionData.data.litterAdded
          const dataInStore = client.readQuery({ query: ALL_LITTERS })
          if (!includedIn(dataInStore.allLitters, addedLitter)) {
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
