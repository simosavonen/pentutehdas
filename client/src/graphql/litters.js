import { gql } from 'apollo-boost'

export const allLitters = gql`
{
  allLitters {
    duedate
    dam {
      name
      breed
    }
    sire {
      name
      breed
    }
    price
    id
  }
}
`
