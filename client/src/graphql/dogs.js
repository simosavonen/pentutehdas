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

