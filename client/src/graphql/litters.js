import { gql } from 'apollo-boost'

export const ALL_LITTERS = gql`
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
    puppies
    price
    breeder {
      username
    }
    id
  }
}
`

export const CREATE_LITTER = gql`
mutation createLitter($duedate: String!, $dam: String, $sire: String, $price: Int, $puppies: [Boolean]) {
  addLitter(
    duedate: $duedate,
    dam: $dam,
    sire: $sire,
    price: $price,
    puppies: $puppies    
  ) {
    duedate
    price    
    id
  }
}
`
