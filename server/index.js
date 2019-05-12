if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const { ApolloServer, UserInputError, AuthenticationError, gql } = require('apollo-server')

const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const Dog = require('./models/dog')
const Litter = require('./models/litter')
const User = require('./models/user')

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
    price: Int,
    breeder: User!
    id: ID!
  }

  type Dog {
    name: String
    born: String,
    isFemale: Boolean,
    breed: String,
    owner: User!
    id: ID!
  }

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

  type Query {
    allLitters: [Litter!]!
    allDogs: [Dog!]!
    me(token: String): User
  }

  type Mutation {
    addDog(
      name: String!
      born: String
      isFemale: Boolean!
      breed: String
    ): Dog
    addLitter(
      duedate: String!
      dam: String
      sire: String
      puppies: [Boolean]
      reservations: [String]
      price: Int
    ): Litter
    createUser(
      username: String!
      password: String!
      phone: String
      email: String
      city: String
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }
`

const resolvers = {
  Query: {
    allLitters: () => Litter.find({}).populate(['dam', 'sire', 'breeder']),
    allDogs: () => Dog.find({}).populate('owner'),
    me: async (root, args) => {
      const decodedToken = jwt.verify(
        args.token, process.env.JWT_SECRET
      )
      console.log('decodedToken.id ', decodedToken.id)
      const currentUser = await User.findById(decodedToken.id)
      console.log('currentUser ', currentUser)
      return currentUser
    },
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
    },
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
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
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

server.listen(process.env.PORT || 4000).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})