import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useApolloClient } from 'react-apollo-hooks'
import {
  BrowserRouter as Router,
  Route, Redirect
} from 'react-router-dom'
import Litter from './components/Litter'
import Navigation from './components/Navigation'
import LitterForm from './components/LitterForm'
import DogForm from './components/DogForm'
import { ALL_LITTERS } from './graphql/litters'
import { LOGIN } from './graphql/login'


const App = () => {
  const [token, setToken] = useState(null)


  const client = useApolloClient()

  useEffect(() => {
    setToken(localStorage.getItem('pentutehdas-user-token'))
  }, [])

  const allLitters = useQuery(ALL_LITTERS)
  const login = useMutation(LOGIN)

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  return (
    <div>
      <Router>
        <Navigation
          token={token}
          setToken={setToken}
          login={login}
          logout={logout}
        />
        <Route exact path='/' render={() => <Litter result={allLitters} />} />
        <Route exact path='/litter' render={() =>
          token ? <LitterForm /> : <Redirect to='/' />} />
        <Route exact path='/dog' render={() =>
          token ? <DogForm /> : <Redirect to='/' />} />
      </Router>

    </div>
  )
}

export default App
