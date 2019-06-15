import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'
import 'bulma/css/bulma.min.css'
import { Footer, Navigation, Routes, UserContextProvider } from './components'

const App = () => {
  return (
    <div className='site'>
      <Router>
        <UserContextProvider>
          <Navigation />
          <Routes />
          <Footer />
        </UserContextProvider>
      </Router>

      <ToastContainer pauseOnFocusLoss={false} position='bottom-right' />
    </div>
  )
}

export default App
