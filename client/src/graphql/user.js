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

export const USER_AVAILABLE = gql`
query userAvailable($username:String!) {
  userAvailable(username:$username)  
}
`