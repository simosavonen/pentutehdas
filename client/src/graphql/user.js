import { gql } from 'apollo-boost'

export const USER = gql`
{
  me {
    username
    role
    phone
    email
    city
    id
  }
}
`