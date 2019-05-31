import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import ApolloClient from 'apollo-client'
import { ApolloProvider } from 'react-apollo'
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { setContext } from 'apollo-link-context'
import { BrowserRouter as Router } from 'react-router-dom'

import { split } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faMars, faVenus, faAt, faPhone, faGlobe, faCalendarAlt, faEuroSign, faPaw } from '@fortawesome/free-solid-svg-icons'
import { fab, faGithub, faLinkedin, faGithubSquare } from '@fortawesome/free-brands-svg-icons'
import './index.css'

library.add(faMars, faVenus, faAt, faPhone, faGlobe, faCalendarAlt, faEuroSign, faPaw, fab, faGithub, faLinkedin, faGithubSquare)

const socketUri = process.env.NODE_ENV === 'development'
  ? 'ws://localhost:4000/graphql'
  : 'wss://pentutehdas.herokuapp.com/graphql'

const httpUri = process.env.NODE_ENV === 'development'
  ? 'http://localhost:4000/graphql'
  : 'https://pentutehdas.herokuapp.com/graphql'

const wsLink = new WebSocketLink({
  uri: socketUri,
  options: {
    reconnect: true,
    lazy: true,
    timeout: 20000,
  }
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
    }
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
  cache: new InMemoryCache()
})

ReactDOM.render(
  <ApolloProvider client={client}>
    <ApolloHooksProvider client={client}>
      <Router>
        <App />
      </Router>
    </ApolloHooksProvider>
  </ApolloProvider>,
  document.getElementById('root')
)
