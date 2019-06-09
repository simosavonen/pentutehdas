const { ForbiddenError, gql } = require('apollo-server')
const Dog = require('../models/dog')
const Litter = require('../models/litter')
const User = require('../models/user')
const bcrypt = require('bcrypt')

export const typeDefs = gql`
  extend type Mutation {
    reset: Boolean
  }
`

export const resolvers = {
  Mutation: {
    reset: async () => {
      if (process.env.NODE_ENV === 'test') {
        try {
          await Dog.deleteMany({})
          await Litter.deleteMany({})
          await User.deleteMany({})

          const saltRounds = 10
          const passwordHash = await bcrypt.hash('ananas', saltRounds)

          const admin = new User({
            username: 'admin',
            passwordHash: passwordHash,
            role: 'admin',
            phone: '0401234567',
            email: 'admin@test.com',
            city: 'Cypress City',
          })
          await admin.save()

          const user = new User({
            username: 'testuser',
            passwordHash: passwordHash,
            role: 'user',
            phone: '050555000',
            email: 'user@test.com',
            city: 'Cypress Capitol',
          })
          await user.save()
        } catch (error) {
          console.log('DB reset failed', error)
        } finally {
          console.log('DB reset OK')
          return true
        }
      } else {
        throw new ForbiddenError('only allowed during testing')
      }
    },
  },
}
