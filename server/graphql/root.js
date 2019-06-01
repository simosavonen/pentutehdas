const { gql } = require('apollo-server')

export const root = gql`
  type Query {
    root: String
  }
  type Mutation {
    root: String
  }
  type Subscription {
    root: String
  }
`
