const { gql } = require('apollo-server')

export const litter = gql`
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
  }

  extend type Subscription {
    litterAdded: Litter!
  }
`
