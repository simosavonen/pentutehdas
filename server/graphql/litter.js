const { UserInputError, AuthenticationError, ForbiddenError, gql, PubSub } = require('apollo-server')
const Litter = require('../models/litter')
const pubsub = new PubSub()

export const typeDefs = gql`
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

  extend type Query {
    allLitters: [Litter!]!        
  }

  extend type Mutation {    
    addLitter(
      duedate: String!
      dam: String
      sire: String
      puppies: [Boolean]
      reservations: [String]
      price: Int
    ): Litter
    updateLitter(
      id: ID!
      duedate: String!      
      sire: String
      puppies: [Boolean]
      price: Int
    ): Litter
    deleteLitter(
      id: ID!
    ): Litter
    toggleReservation(
      id: ID!      
    ): Litter    
  }
  
  type Subscription {
    litterAdded: Litter!
  }
`

export const resolvers = {
  Query: {
    allLitters: () => Litter.find({})
      .populate(['dam', 'sire', 'breeder', 'reservations'])
  },
  Mutation: {
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

      const populatedLitter = await Litter.findById(litter._id.toString())
        .populate(['dam', 'sire', 'breeder', 'reservations'])
      pubsub.publish('LITTER_ADDED', { litterAdded: populatedLitter })
      return populatedLitter
    },
    updateLitter: async (root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new AuthenticationError('not authenticated')
      }
      const litterToBeUpdated = await Litter.findById(args.id)
      if (!litterToBeUpdated) {
        throw new UserInputError('cannot find the litter to update')
      }

      const isAdmin = currentUser.role === 'admin'
      if (currentUser._id.toString() === litterToBeUpdated.breeder.toString() || isAdmin) {
        const updatedLitter = await Litter.findByIdAndUpdate(args.id, {
          duedate: args.duedate,
          sire: args.sire,
          puppies: args.puppies,
          price: args.price
        }, { new: true })
          .populate(['dam', 'sire', 'breeder', 'reservations'])
        return updatedLitter
      } else {
        throw new ForbiddenError('you are not the admin, or the breeder')
      }
    },
    deleteLitter: async (root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new AuthenticationError('not authenticated')
      }
      const litterToBeDeleted = await Litter.findById(args.id)
      if (!litterToBeDeleted) {
        throw new UserInputError('cannot find the litter to delete')
      }
      const isAdmin = currentUser.role === 'admin'
      if (currentUser._id.toString() === litterToBeDeleted.breeder.toString() || isAdmin) {
        const deletedLitter = await Litter.findByIdAndDelete(args.id)
        return deletedLitter
      } else {
        throw new ForbiddenError('you are not the admin, or the breeder')
      }
    },
    toggleReservation: async (root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new AuthenticationError('not authenticated')
      }
      const theLitter = await Litter.findById(args.id)
      if (!theLitter) {
        throw new UserInputError('cannot find the litter to add reservation to')
      }
      try {
        if (theLitter.reservations.includes(currentUser._id.toString())) {
          const updatedLitter = await Litter.findByIdAndUpdate(args.id, {
            reservations: theLitter.reservations.filter(r => r.toString() !== currentUser._id.toString())
          }, { new: true })
            .populate(['dam', 'sire', 'breeder', 'reservations'])
          return updatedLitter
        } else {
          const updatedLitter = await Litter.findByIdAndUpdate(args.id, {
            reservations: theLitter.reservations.concat(currentUser._id.toString())
          }, { new: true })
            .populate(['dam', 'sire', 'breeder', 'reservations'])
          return updatedLitter
        }
      } catch (error) {
        console.log(error)
      }
    }
  },
  Subscription: {
    litterAdded: {
      subscribe: () => pubsub.asyncIterator(['LITTER_ADDED'])
    }
  }
}
