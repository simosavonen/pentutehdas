import React from 'react'
import { Query, ApolloConsumer } from 'react-apollo'
import Litter from './components/Litter'

import { allLitters } from './graphql/litters'

const App = () => {
  return (
    <div>
      <ApolloConsumer>
        {(client =>
          <Query query={allLitters}>
            {(result) => <Litter result={result} />}
          </Query>
        )}
      </ApolloConsumer>
    </div>
  )
}

export default App
