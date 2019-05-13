import { gql } from 'apollo-boost'

export const ALL_DOGS = gql`
{
  allDogs {
    name
    born
    isFemale
    breed
    owner {
      username
    }
    id
  }
}
`

export const CREATE_DOG = gql`
mutation createDog($name: String!, $born: String, $isFemale: Boolean!, $breed: String) {
  addDog(
    name: $name,
    born: $born,
    isFemale: $isFemale,
    breed: $breed
  ) {
    name,
    born,
    isFemale,
    breed,
    owner {
      username
    }
    id
  }
}
`

