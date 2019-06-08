import React from 'react'
import { Subscription } from 'react-apollo'
import { BrowserRouter as Router } from 'react-router-dom'
import { useApolloClient } from 'react-apollo-hooks'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'
import 'bulma/css/bulma.min.css'

import { Navigation, Footer, Routes } from './components'
import { ALL_LITTERS, LITTER_ADDED } from './graphql/litters'

const App = () => {
  const client = useApolloClient()

  return (
    <div className='site'>
      <Router>
        <Navigation />
        <Routes />
        <Footer />
      </Router>

      <Subscription
        subscription={LITTER_ADDED}
        onSubscriptionData={({ subscriptionData }) => {
          const addedLitter = subscriptionData.data.litterAdded
          const dataInStore = client.readQuery({ query: ALL_LITTERS })
          if (!dataInStore.allLitters.map(p => p.id).includes(addedLitter.id)) {
            dataInStore.allLitters.push(addedLitter)
            client.writeQuery({
              query: ALL_LITTERS,
              data: dataInStore,
            })
            toast.info('A litter was added.')
          }
        }}
      >
        {() => null}
      </Subscription>

      <ToastContainer pauseOnFocusLoss={false} position='bottom-right' />
    </div>
  )
}

export default App
