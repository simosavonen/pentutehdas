import React, { createContext, useEffect, useState } from 'react'
import { useApolloClient } from 'react-apollo-hooks'
import { USER } from '../../graphql/user'

export const Context = createContext({})

export const Provider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  useEffect(() => {
    setToken(localStorage.getItem('pentutehdas-user-token'))
  }, [])

  useEffect(() => {
    client
      .query({ query: USER, fetchPolicy: 'no-cache' })
      .then(({ data }) => setUser(data.me))
  }, [client, token])

  const userContext = {
    user,
    setUser,
  }

  return <Context.Provider value={userContext}>{children}</Context.Provider>
}

export const { Consumer } = Context
