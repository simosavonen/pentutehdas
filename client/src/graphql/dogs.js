import { gql } from 'apollo-boost'

export const allDogs = gql`
{
  allDogs {
    name
    born
    isFemale
    breed
    id
  }
}
`

