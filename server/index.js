if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const { ApolloServer, UserInputError, AuthenticationError, ForbiddenError, gql } = require('apollo-server')

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
    reservations: [User],
    price: Int,
    breeder: User!
    id: ID!
  }

  type Dog {
    name: String!
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
    userAvailable(username: String!): Boolean
  }

  type Mutation {
    addDog(
      name: String!
      born: String
      isFemale: Boolean!
      breed: String
    ): Dog
    deleteDog(
      id: ID!
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
  }
`

const resolvers = {
  Query: {
    allLitters: () => Litter.find({}).populate(['dam', 'sire', 'breeder']),
    allDogs: () => Dog.find({}).populate('owner'),
    me: (root, args, context) => {
      return context.currentUser
    },
    userAvailable: async (root, args) => {
      const taken = await User.findOne({ username: args.username })
      return taken ? false : true
    }
  },
  Mutation: {
    addDog: async (root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new AuthenticationError('not authenticated')
      }
      let dog
      try {
        dog = new Dog({
          name: args.name,
          born: args.born,
          isFemale: args.isFemale,
          breed: args.breed,
          owner: currentUser // pelkkä ObjectID viittaus
        })
        await dog.save()

      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
      return dog.populate('owner') // tarvitaan populate
    },
    deleteDog: async (root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new AuthenticationError('not authenticated')
      }
      const dogToBeDeleted = await Dog.findById(args.id)
      if (!dogToBeDeleted) {
        throw new UserInputError('cannot find a dog to delete')
      }
      const isAdmin = currentUser.role === 'admin'
      // comparing the ObjectIDs did not work, change toString
      if (currentUser._id.toString() === dogToBeDeleted.owner.toString() || isAdmin) {
        const deletedDog = await Dog.findByIdAndDelete(args.id)
        return deletedDog
      } else {
        throw new ForbiddenError('you are not the admin, or the dog owner')
      }
    },
    addLitter: async (root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new AuthenticationError('not authenticated')
      }

      let litter
      try {
        litter = new Litter({
          duedate: args.duedate,
          dam: args.dam,
          sire: args.sire,
          puppies: args.puppies,
          reservations: [],
          price: args.price,
          breeder: currentUser
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