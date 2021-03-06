import * as Sentry from '@sentry/browser'
import { InMemoryCache } from 'apollo-cache-inmemory'
import ApolloClient from 'apollo-client'
import { split } from 'apollo-link'
import { setContext } from 'apollo-link-context'
import { createHttpLink } from 'apollo-link-http'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
import React from 'react'
import { ApolloProvider } from 'react-apollo'
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks'
import ReactDOM from 'react-dom'
import App from './App'
import './fontawesome'
import './index.css'

Sentry.init({
  dsn: 'https://614a80e14fd14c1c9e0b6e8621dddc31@sentry.io/1473320',
})

const socketUri =
  process.env.NODE_ENV === 'development'
    ? 'ws://localhost:4000/graphql'
    : 'wss://pentutehdas.herokuapp.com/graphql'

const httpUri =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:4000/graphql'
    : 'https://pentutehdas.herokuapp.com/graphql'

const wsLink = new WebSocketLink({
  uri: socketUri,
  options: {
    reconnect: true,
    reconnectionAttempts: 3,
    lazy: true,
    timeout: 300000,
  },
})

const httpLink = createHttpLink({
  uri: httpUri,
})

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('pentutehdas-user-token')
  return {
    headers: {
      ...headers,
      authorization: token ? `bearer ${token}` : null,
    },
  }
})

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    return kind === 'OperationDefinition' && operation === 'subscription'
  },
  wsLink,
  authLink.concat(httpLink)
)

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
})

ReactDOM.render(
  <ApolloProvider client={client}>
    <ApolloHooksProvider client={client}>
      <App />
    </ApolloHooksProvider>
  </ApolloProvider>,
  document.getElementById('root')
)
