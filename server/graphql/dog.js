const { gql } = require('apollo-server')

export const dog = gql`
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
