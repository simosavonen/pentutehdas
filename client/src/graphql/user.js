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
    username
    role
    phone
    email
    city
    id   
  }
}
`

export const UPDATE_USER = gql`
mutation updateUser($id:ID!, $username:String!, $phone:String, $email:String, $city:String) {
  updateUser(
    id:$id,
    username:$username,
    phone:$phone,
    email:$email,
    city:$city    
  ) {
    username
    role
    phone
    email
    city
    id   
  }
}
`

