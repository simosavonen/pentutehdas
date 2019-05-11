import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useApolloClient } from 'react-apollo-hooks'
import Litter from './components/Litter'
import Navigation from './components/Navigation'
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
      <Navigation
        token={token}
        setToken={setToken}
        login={login}
        logout={logout}
      />
      <Litter result={allLitters} />
    </div>
  )
}

export default App
