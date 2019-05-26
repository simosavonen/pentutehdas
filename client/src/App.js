import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useApolloClient } from 'react-apollo-hooks'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import Litter from './components/Litter'
import Navigation from './components/Navigation'
import LitterForm from './components/LitterForm'
import LoginForm from './components/LoginForm'
import Dogs from './components/Dogs'
import UserForm from './components/UserForm'
import Footer from './components/Footer'
import { ALL_LITTERS, CREATE_LITTER } from './graphql/litters'
import { ALL_DOGS, CREATE_DOG, DELETE_DOG } from './graphql/dogs'
import { LOGIN } from './graphql/login'
import { USER, CREATE_USER, UPDATE_USER } from './graphql/user'



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
    console.log(error)
  }

  const allLitters = useQuery(ALL_LITTERS)
  const allDogs = useQuery(ALL_DOGS)
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
    }
  })

  const addUserMutation = useMutation(CREATE_USER, {
    onError: handleError
  })

  const updateUserMutation = useMutation(UPDATE_USER, {
    onError: handleError,
    update: (store, response) => {
      console.log(response.data.updateUser)
      setUser(response.data.updateUser)
    }
  })

  const addLitterMutation = useMutation(CREATE_LITTER, {
    onError: handleError,
    refetchQueries: [{ query: ALL_LITTERS }]
  })

  const deleteDogMutation = useMutation(DELETE_DOG, {
    onError: handleError,
    update: (store, response) => {
      const dataInStore = store.readQuery({ query: ALL_DOGS })
      //console.log('response.data.deleteDog', response.data.deleteDog)
      //console.log('before filter', dataInStore.allDogs)
      dataInStore.allDogs = dataInStore.allDogs.filter(dog => dog.id !== response.data.deleteDog.id)
      //console.log('after filter', dataInStore.allDogs)
      store.writeQuery({
        query: ALL_DOGS,
        data: dataInStore
      })
    }
  })

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  const login = async (username, password) => {
    try {
      const result = await loginMutation({
        variables: { username, password }
      })
      const token = result.data.login.value
      setToken(token)
      localStorage.setItem('pentutehdas-user-token', token)
      return true
    } catch (error) {
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
          <Route exact path='/' render={() => <Litter result={allLitters} user={user} />} />
          <Route exact path='/login' render={() => <LoginForm login={login} addUser={addUserMutation} />} />
          <Route exact path='/litter' render={() =>
            user && ['breeder', 'admin'].includes(user.role)
              ? <LitterForm
                user={user}
                result={allDogs}
                addLitter={addLitterMutation}
              />
              : <Redirect to='/' />} />
          <Route exact path='/dog' render={() =>
            user && ['breeder', 'admin'].includes(user.role)
              ? <Dogs
                user={user}
                result={allDogs}
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
    </div>
  )
}

export default App
