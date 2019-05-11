import { gql } from 'apollo-boost'

export const USER = gql`
query me($token: String){
  me(token: $token) {
    username
    role
    phone
    email
    city
    id
  }
}
`