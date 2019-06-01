const { gql } = require('apollo-server')

export const typeDefs = gql`
  type Dog {
    name: String!
    born: String,
    isFemale: Boolean,
    breed: String,
    owner: User!
    id: ID!
  }

  extend type Query {
    allDogs: [Dog!]!    
  }

  extend type Mutation {
    addDog(
      name: String!
      born: String
      isFemale: Boolean!
      breed: String
    ): Dog
    deleteDog(
      id: ID!
    ): Dog    
  }
`

export const resolvers = {
  Query: {
    allDogs: () => Dog.find({}).populate('owner')
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
    }
  }
}
