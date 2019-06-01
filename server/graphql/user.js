const { UserInputError, AuthenticationError, gql } = require('apollo-server')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


export const typeDefs = gql`
  type User {
    username: String!
    passwordHash: String
    role: String
    phone: String
    email: String
    city: String
    id: ID!
  }

  type Token {
    value: String!
  }

  extend type Query {    
    me(token: String): User    
  }

  extend type Mutation {
    createUser(
      username: String!
      password: String!
      phone: String
      email: String
      city: String
    ): User
    updateUser(
      username: String!      
      phone: String
      email: String
      city: String
      id: ID!
    ): User
    login(
      username: String!
      password: String!
    ): Token
    userAvailable(
      username: String!
    ): Boolean
  }
`

export const resolvers = {
  Query: {
    me: (root, args, context) => {
      return context.currentUser
    },
  },
  Mutation: {
    createUser: async (root, args) => {
      const saltRounds = 10
      const passwordHash = await bcrypt.hash(args.password, saltRounds)

      const user = new User({
        username: args.username,
        passwordHash: passwordHash,
        role: 'user',
        phone: args.phone,
        email: args.email,
        city: args.city
      })

      return user.save()
        .catch(error => {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          })
        })
    },
    updateUser: async (root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new AuthenticationError('not authenticated')
      }
      if (currentUser._id.toString() !== args.id.toString()) {
        throw new AuthenticationError('not authenticated')
      }

      const updatedUser = await User.findByIdAndUpdate(currentUser._id, {
        username: args.username,
        phone: args.phone,
        email: args.email,
        city: args.city
      }, { new: true })

      return updatedUser
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(args.password, user.passwordHash)

      if (!(user && passwordCorrect)) {
        throw new UserInputError("wrong credentials")
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },
    userAvailable: async (root, args) => {
      const taken = await User.findOne({ username: args.username })
      return taken ? false : true
    }
  }
}
