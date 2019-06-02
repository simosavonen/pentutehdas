import { gql } from 'apollo-boost'

const USER_DETAILS = gql`
fragment UserDetails on User {
  username
  role
  phone
  email
  city
  id   
}
`

export const USER = gql`
query me($token: String){
  me(token: $token) {
    ...UserDetails
  }
}
${USER_DETAILS}
`

export const USERS = gql`
query users($ids: [String!]!){
  users(ids: $ids) {
    ...UserDetails
  }
}
${USER_DETAILS}
`

export const USER_AVAILABLE = gql`
mutation userAvailable($username:String!) {
  userAvailable(username:$username)  
}
`

export const CREATE_USER = gql`
mutation createUser(
  $username:String!, 
  $password:String!, 
  $phone:String, 
  $email:String, 
  $city:String) {
  createUser(
    username:$username,
    password:$password,
    phone:$phone,
    email:$email,
    city:$city    
  ) {
    ...UserDetails  
  }
}
${USER_DETAILS}
`

export const UPDATE_USER = gql`
mutation updateUser(
  $id:ID!, 
  $username:String!, 
  $phone:String, 
  $email:String, 
  $city:String) {
  updateUser(
    id:$id,
    username:$username,
    phone:$phone,
    email:$email,
    city:$city    
  ) {
    ...UserDetails 
  }
}
${USER_DETAILS}
`

