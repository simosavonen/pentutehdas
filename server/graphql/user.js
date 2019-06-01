const { gql } = require('apollo-server')

export const user = gql`
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

  extend type Query {    
    me(token: String): User    
  }

  extend type Mutation {
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
    userAvailable(
      username: String!
    ): Boolean
  }
`
