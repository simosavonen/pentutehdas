import React from 'react'
import { Query, ApolloConsumer } from 'react-apollo'
import { gql } from 'apollo-boost'
import Litter from './components/Litter'

const ALL_DOGS = gql`
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

const ALL_LITTERS = gql`
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

const App = () => {
  return (
    <div>
      <ApolloConsumer>
        {(client =>
          <Query query={ALL_LITTERS}>
            {(result) => <Litter result={result} />}
          </Query>
        )}
      </ApolloConsumer>
    </div>
  )
}

export default App
