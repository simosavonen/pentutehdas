if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const { ApolloServer } = require('apollo-server')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const User = require('./models/user')

mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)

const Sentry = require('@sentry/node');
Sentry.init({ dsn: 'https://614a80e14fd14c1c9e0b6e8621dddc31@sentry.io/1473320' });

const MONGODB_URI = process.env.MONGODB_URI

mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

import { typeDefs, resolvers } from './graphql'

const server = new ApolloServer({
  typeDefs,
  resolvers,
  engine: {
    rewriteError(err) {
      Sentry.captureException(err)
      return err
    }
  },
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null

    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), process.env.JWT_SECRET
      )
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  }
})

server.listen(process.env.PORT || 4000).then(({ url, subscriptionsUrl }) => {
  console.log(`Server ready at ${url}`)
  console.log(`Subscriptions ready at ${subscriptionsUrl}`)
})