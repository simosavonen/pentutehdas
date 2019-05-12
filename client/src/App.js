import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useApolloClient } from 'react-apollo-hooks'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import Litter from './components/Litter'
import Navigation from './components/Navigation'
import LitterForm from './components/LitterForm'
import DogForm from './components/DogForm'
import UserForm from './components/UserForm'
import Footer from './components/Footer'
import { ALL_LITTERS } from './graphql/litters'
import { LOGIN } from './graphql/login'


const App = () => {
  const [token, setToken] = useState(null)

  const client = useApolloClient()

  useEffect(() => {
    setToken(localStorage.getItem('pentutehdas-user-token'))
  }, [])

  const allLitters = useQuery(ALL_LITTERS)
  const loginMutation = useMutation(LOGIN)

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

    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <Router>
        <Navigation
          token={token}
          login={login}
          logout={logout}
        />
        <Route exact path='/' render={() => <Litter result={allLitters} />} />
        <Route exact path='/litter' render={() =>
          token ? <LitterForm /> : <Redirect to='/' />} />
        <Route exact path='/dog' render={() =>
          token ? <DogForm /> : <Redirect to='/' />} />
        <Route exact path='/user' render={() =>
          token ? <UserForm token={token} /> : <Redirect to='/' />} />
        <Footer />
      </Router>
    </div>
  )
}

export default App
