import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useApolloClient } from 'react-apollo-hooks'
import { Subscription } from 'react-apollo'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'

import Litter from './components/Litter'
import Navigation from './components/Navigation'
import LitterForm from './components/LitterForm'
import LoginForm from './components/LoginForm'
import Dogs from './components/Dogs'
import UserForm from './components/UserForm'
import Footer from './components/Footer'

import { ALL_LITTERS, CREATE_LITTER, UPDATE_LITTER, LITTER_ADDED, DELETE_LITTER } from './graphql/litters'
import { ALL_DOGS, CREATE_DOG, DELETE_DOG } from './graphql/dogs'
import { LOGIN } from './graphql/login'
import { USER, CREATE_USER, UPDATE_USER, USER_AVAILABLE } from './graphql/user'

const App = () => {
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)
  const [showAll, setShowAll] = useState(false) // for filtering litters

  const client = useApolloClient()

  useEffect(() => {
    setToken(localStorage.getItem('pentutehdas-user-token'))
  }, [])

  useEffect(() => {
    client.query({ query: USER, fetchPolicy: 'network-only' })
      .then(result => { setUser(result.data.me) })
  }, [client, token])

  const handleError = (error) => {
    console.log(error)
  }

  const includedIn = (set, object) =>
    set.map(p => p.id).includes(object.id)

  const allLitters = useQuery(ALL_LITTERS)
  const allDogs = useQuery(ALL_DOGS)
  const userAvailableQuery = useMutation(USER_AVAILABLE)
  const loginMutation = useMutation(LOGIN)
  const addDogMutation = useMutation(CREATE_DOG, {
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

  const addUserMutation = useMutation(CREATE_USER, {
    onError: handleError
  })

  const updateUserMutation = useMutation(UPDATE_USER, {
    onError: handleError,
    refetchQueries: [{ query: ALL_LITTERS }],
    update: (store, response) => {
      setUser(response.data.updateUser)
      toast.info('User was updated.')
    }
  })

  const addLitterMutation = useMutation(CREATE_LITTER, {
    onError: handleError,
    refetchQueries: [{ query: ALL_LITTERS }]
  })

  const editLitterMutation = useMutation(UPDATE_LITTER, {
    onError: handleError,
    refetchQueries: [{ query: ALL_LITTERS }]
  })

  const deleteDogMutation = useMutation(DELETE_DOG, {
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

  const deleteLitterMutation = useMutation(DELETE_LITTER, {
    onError: handleError,
    update: (store, response) => {
      const dataInStore = store.readQuery({ query: ALL_LITTERS })
      dataInStore.allLitters = dataInStore.allLitters.filter(litter => litter.id !== response.data.deleteLitter.id)
      store.writeQuery({
        query: ALL_LITTERS,
        data: dataInStore
      })
      toast.info('Litter was removed.')
    }
  })

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
    toast.info('Logout OK')
  }

  const login = async (username, password) => {
    try {
      const result = await loginMutation({
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
          logout={logout}
        />

        <section className='section site-content'>
          <Route exact path='/' render={() =>
            <Litter
              litters={allLitters}
              dogs={allDogs}
              user={user}
              editLitter={editLitterMutation}
              deleteLitter={deleteLitterMutation}
              showAll={showAll}
              setShowAll={setShowAll}
            />} />
          <Route exact path='/login' render={() =>
            <LoginForm
              login={login}
              addUser={addUserMutation}
              userAvailable={userAvailableQuery}
            />} />
          <Route exact path='/litter' render={() =>
            user && ['breeder', 'admin'].includes(user.role)
              ? <div className='columns is-centered'>
                <div className='column is-full-mobile is-two-thirds-tablet is-half-desktop'>
                  <LitterForm
                    user={user}
                    dogs={allDogs}
                    addLitter={addLitterMutation}
                  />
                </div>
              </div>
              : <Redirect to='/' />} />
          <Route exact path='/dog' render={() =>
            user && ['breeder', 'admin'].includes(user.role)
              ? <Dogs
                user={user}
                dogs={allDogs}
                addDog={addDogMutation}
                deleteDog={deleteDogMutation}
              />
              : <Redirect to='/' />} />
          <Route exact path='/user' render={() =>
            user
              ? <UserForm user={user} updateUser={updateUserMutation} />
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

      <ToastContainer />

    </div>
  )
}

export default App
