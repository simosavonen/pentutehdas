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
    users(ids: [String!]!): [User] 
    userAvailable(username: String!): Boolean
    allUsers: [User!]!   
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
    updateRole(
      username: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token    
  }
`

export const resolvers = {
  Query: {
    me: (root, args, context) => {
      return context.currentUser
    },
    users: async (root, args, context) => {
      const currentUser = context.currentUser
      if (currentUser && ['admin', 'breeder'].includes(currentUser.role)) {
        const result = await User.find({ '_id': { $in: args.ids } })
        return result
      }
    },
    allUsers: async (root, args, context) => {
      const currentUser = context.currentUser
      if (currentUser && currentUser.role === 'admin') {
        const result = await User.find({})
        return result
      } else {
        throw new AuthenticationError('you are not an admin')
      }
    },
    userAvailable: async (root, args) => {
      const taken = await User.findOne({ username: args.username })
      return taken ? false : true
    }
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
    updateRole: async (root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser && currentUser.role !== 'admin') {
        throw new AuthenticationError('not authenticated')
      }
      const userToUpdate = await User.findOne({ username: args.username })
      if (!userToUpdate) {
        throw new UserInputError('cannot find the user to update')
      }
      if (userToUpdate.role === 'admin') {
        throw new UserInputError('cannot touch admins')
      }
      const newRole = userToUpdate.role === 'user' ? 'breeder' : 'user'
      const updatedUser = await User.findByIdAndUpdate(userToUpdate._id, {
        role: newRole
      }, { new: true })
      return updatedUser
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(args.password, user.passwordHash)

      if (!(user && passwordCorrect)) {
        throw new UserInputError('wrong credentials')
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    }
  }
}
