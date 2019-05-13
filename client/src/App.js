import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useApolloClient } from 'react-apollo-hooks'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import Litter from './components/Litter'
import Navigation from './components/Navigation'
import LitterForm from './components/LitterForm'
import LoginForm from './components/LoginForm'
import DogForm from './components/DogForm'
import UserForm from './components/UserForm'
import Footer from './components/Footer'
import { ALL_LITTERS } from './graphql/litters'
import { LOGIN } from './graphql/login'
import { USER } from './graphql/user'


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
    <div className='site'>
      <Router>
        <Navigation
          token={token}
          login={login}
          logout={logout}
        />
        <div className='site-content'>
          <section className='section'>
            <Route exact path='/' render={() => <Litter result={allLitters} />} />
            <Route exact path='/login' render={() => <LoginForm />} />
            <Route exact path='/litter' render={() =>
              user && ['breeder', 'admin'].includes(user.role)
                ? <LitterForm user={user} />
                : <Redirect to='/' />} />
            <Route exact path='/dog' render={() =>
              user && ['breeder', 'admin'].includes(user.role)
                ? <DogForm user={user} />
                : <Redirect to='/' />} />
            <Route exact path='/user' render={() =>
              user
                ? <UserForm user={user} />
                : <Redirect to='/' />} />
          </section>
        </div>
        <Footer />
      </Router>
    </div>
  )
}

export default App
