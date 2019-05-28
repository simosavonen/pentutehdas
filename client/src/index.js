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

import { library } from '@fortawesome/fontawesome-svg-core'
import { faMars, faVenus, faAt, faPhone, faGlobe, faCalendarAlt, faEuroSign } from '@fortawesome/free-solid-svg-icons'
import './index.css'

library.add(faMars, faVenus, faAt, faPhone, faGlobe, faCalendarAlt, faEuroSign)

let httpLink = createHttpLink({
  uri: 'https://pentutehdas.herokuapp.com/graphql',
})

if (process.env.NODE_ENV === 'development') {
  httpLink = createHttpLink({
    uri: 'http://localhost:4000/graphql',
  })
}

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('pentutehdas-user-token')
  return {
    headers: {
      ...headers,
      authorization: token ? `bearer ${token}` : null,
    }
  }
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
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
