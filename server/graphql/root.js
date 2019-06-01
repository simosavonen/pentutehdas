const { gql } = require('apollo-server')

export const typeDefs = gql`
  type Query {
    root: String
  }
  type Mutation {
    root: String
  }
`
