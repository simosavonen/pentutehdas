import { gql } from 'apollo-boost'

export const ALL_LITTERS = gql`
{
  allLitters {
    duedate
    dam {
      name
      breed
      born
      id
    }
    sire {
      name
      breed
      born
      id
    }
    puppies
    reservations {
      username
      phone
      email
      city
    }
    price
    breeder {
      username
      city
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

export const UPDATE_LITTER = gql`
mutation updateLitter($id: ID!, $duedate: String!, $sire: String, $price: Int, $puppies: [Boolean]) {
  updateLitter(
    id: $id,
    duedate: $duedate,
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
