if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const { ApolloServer, UserInputError, gql } = require('apollo-server')

const mongoose = require('mongoose')

const Dog = require('./models/dog')
const Litter = require('./models/litter')

mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)

const MONGODB_URI = process.env.MONGODB_URI

mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const typeDefs = gql`
  type Litter {
    duedate: String!
    dam: Dog,
    sire: Dog,
    puppies: [Boolean],
    reservations: [String],
    price: Int
    id: ID!
  }

  type Dog {
    name: String
    born: String,
    isFemale: Boolean,
    breed: String
    id: ID!
  }

  type Query {
    allLitters: [Litter!]!
    allDogs: [Dog!]!
  }

  type Mutation {
    addDog(name: String!, born: String, isFemale: Boolean!, breed: String): Dog
    addLitter(duedate: String!, dam: String, sire: String, puppies: [Boolean], reservations: [String], price: Int): Litter
  }
`

const resolvers = {
  Query: {
    allLitters: () => Litter.find({}).populate(['dam', 'sire']),
    allDogs: () => Dog.find({})
  },
  Mutation: {
    addDog: async (root, args) => {
      let dog
      try {

        dog = new Dog({
          name: args.name,
          born: args.born,
          isFemale: args.isFemale,
          breed: args.breed
        })
        await dog.save()

      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
      return dog
    },
    addLitter: async (root, args) => {
      let litter
      try {

        litter = new Litter({
          duedate: args.duedate,
          dam: args.dam,
          sire: args.sire,
          puppies: [],
          reservations: [],
          price: args.price
        })
        await litter.save()

      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
      return litter
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})