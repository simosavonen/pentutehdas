import { gql } from 'apollo-boost'

const DOG_DETAILS = gql`
fragment DogDetails on Dog {
  name
    born
    isFemale
    breed
    owner {
      username
    }
    id
}
`

export const ALL_DOGS = gql`
{
  allDogs {
    ...DogDetails
  }
}
${DOG_DETAILS}
`

export const CREATE_DOG = gql`
mutation createDog($name: String!, $born: String, $isFemale: Boolean!, $breed: String) {
  addDog(
    name: $name,
    born: $born,
    isFemale: $isFemale,
    breed: $breed
  ) {
    ...DogDetails
  }
}
${DOG_DETAILS}
`

export const DELETE_DOG = gql`
mutation deleteDog($id: ID!) {
  deleteDog(
    id: $id
  ) {
    id
  }
}
`

