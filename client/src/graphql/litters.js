import { gql } from 'apollo-boost'

const LITTER_DETAILS = gql`
fragment LitterDetails on Litter {
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
      id      
    }
    price
    breeder {
      username
      city
    }
    id
}
`

export const ALL_LITTERS = gql`
{
  allLitters {
    ...LitterDetails
  }
}
${LITTER_DETAILS}
`

export const LITTER_ADDED = gql`
subscription {
  litterAdded {
    ...LitterDetails
  }
}
${LITTER_DETAILS}
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

export const DELETE_LITTER = gql`
mutation deleteLitter($id: ID!) {
  deleteLitter(
    id: $id
  ) {
    id
  }
}
`

export const TOGGLE_RESERVATION = gql`
mutation toggleReservation($id: ID!) {
  toggleReservation(
    id: $id
  ) {
    ...LitterDetails
  }
}
${LITTER_DETAILS}
`
