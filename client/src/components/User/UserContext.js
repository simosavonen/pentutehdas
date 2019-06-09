import React, { createContext, useState } from 'react'

export const Context = createContext({})

export const Provider = ({ children }) => {
  const [user, setUser] = useState(null)
  const userContext = {
    user,
    setUser,
  }

  return <Context.Provider value={userContext}>{children}</Context.Provider>
}

export const { Consumer } = Context
